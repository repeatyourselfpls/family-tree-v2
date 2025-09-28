export interface PersonData {
  nickname?: string;
  birthDate?: string;
  deathDate?: string;
  profilePicture?: string;
  bio?: string;
  location?: string;
  occupation?: string;
}

export class TreeNode {
  static NODE_SIZE = 1;
  static SIBLING_DISTANCE = 0;
  static TREE_DISTANCE = 0;
  static COUPLE_DISTANCE = 1; // should be <= (node_size + sibling_distance) for aesthetics

  name = '';
  personData: PersonData = {};
  children: TreeNode[] = [];
  spouse: TreeNode | null = null;
  isSpouse: boolean = false;
  parent: TreeNode | null = null;
  previousSibling: TreeNode | null = null;
  nextSibling: TreeNode | null = null;
  mod = 0;
  X = 0;
  Y = -1;
  positionedX = -1;
  positionedY = -1;

  constructor(
    name: string,
    children: TreeNode[] = [],
    spouse: TreeNode | null = null,
    personData?: PersonData,
  ) {
    this.name = name;
    this.personData = personData || {};
    this.children = children;
    this.spouse = spouse;
    if (this.spouse) {
      this.spouse.isSpouse = true;
      this.spouse.parent = this;
    }
  }

  // Attaches previous siblings and a base Y for each level
  static initializeNodes(
    node: TreeNode,
    parent: TreeNode | null,
    previousSibling: TreeNode | null,
    nextSibling: TreeNode | null,
    startingY: number,
  ) {
    node.mod = 0;
    node.positionedX = -1;
    node.positionedY = -1;
    node.X = 0;
    node.Y = startingY;
    if (node.spouse) {
      node.spouse.Y = startingY;
      node.spouse.X = -1;
      node.spouse.mod = -1;
      node.spouse.positionedX = -1;
      node.spouse.positionedY = -1;
    }

    node.previousSibling = previousSibling;
    node.nextSibling = nextSibling;
    node.parent = parent;
    for (let i = 0; i < node.children.length; i++) {
      TreeNode.initializeNodes(
        node.children[i],
        node,
        i > 0 ? node.children[i - 1] : null,
        i < node.children.length - 1 ? node.children[i + 1] : null,
        startingY + 1,
      );
    }
  }

  // Calculates the X and Mod bottom up
  static calculateXMod(node: TreeNode) {
    for (const child of node.children) {
      TreeNode.calculateXMod(child);
    }

    if (node.isLeafNode()) {
      if (!node.previousSibling) {
        node.X = 0;
      } else {
        node.X =
          node.previousSibling.X +
          TreeNode.NODE_SIZE +
          TreeNode.SIBLING_DISTANCE;
      }
    } else if (node.children.length == 1) {
      if (!node.previousSibling) {
        node.X = node.getLeftMostChildNode().X;
      } else {
        node.X =
          node.previousSibling.X +
          TreeNode.NODE_SIZE +
          TreeNode.SIBLING_DISTANCE;
        node.mod = node.X - node.getLeftMostChildNode().X;
      }
    } else {
      if (!node.previousSibling) {
        node.X =
          (node.getLeftMostChildNode().X + node.getRightMostChildNode().X) / 2;
      } else {
        node.X =
          node.previousSibling.X +
          TreeNode.NODE_SIZE +
          TreeNode.SIBLING_DISTANCE;
        node.mod =
          node.X -
          (node.getLeftMostChildNode().X + node.getRightMostChildNode().X) / 2; // currentX - desired
      }
    }

    // check if sibling subtrees clash, adjust X and mod if so
    if (node.children.length) {
      TreeNode.checkConflicts2(node);
    }
  }

  static calculateXModWithSpouseCentered(node: TreeNode) {
    for (const child of node.children) {
      TreeNode.calculateXModWithSpouseCentered(child);
    }

    const minDist = node.previousSibling?.spouse
      ? TreeNode.NODE_SIZE +
        TreeNode.SIBLING_DISTANCE +
        TreeNode.COUPLE_DISTANCE
      : TreeNode.NODE_SIZE + TreeNode.SIBLING_DISTANCE;

    // the children still determine the current node's position if no previous siblings exist
    if (node.isLeafNode()) {
      if (!node.previousSibling) {
        node.X = 0;
      } else {
        node.X = node.previousSibling.X + minDist;
      }
    } else if (node.children.length == 1) {
      if (!node.previousSibling) {
        node.X = node.getLeftMostChildNode().X;
      } else {
        node.X = node.previousSibling.X + minDist;
      }
      // but the modifier for the current node is affected to center children over both spouses
      const center = node.spouse
        ? (node.X + node.X + TreeNode.COUPLE_DISTANCE) / 2
        : node.X;
      node.mod = center - node.getLeftMostChildNode().X; // effectively node.X or center
    } else {
      if (!node.previousSibling) {
        node.X =
          (node.getLeftMostChildNode().X + node.getRightMostChildNode().X) / 2;
      } else {
        node.X = node.previousSibling.X + minDist;
      }
      // but the modifier for the current node is affected to center children over both spouses
      const center = node.spouse
        ? (node.X + node.X + TreeNode.COUPLE_DISTANCE) / 2
        : node.X;
      node.mod =
        center -
        (node.getLeftMostChildNode().X + node.getRightMostChildNode().X) / 2; // currentX - desired
    }

    if (node.children.length) {
      TreeNode.checkConflicts2(node);
    }
  }

  // shifts everytime, but resets the contour after each level shift
  static checkConflicts(node: TreeNode) {
    const minDistance = TreeNode.NODE_SIZE + TreeNode.TREE_DISTANCE;
    let leftSibling = node.getLeftMostSibling();
    while (leftSibling && leftSibling != node) {
      let leftContour = TreeNode.getLeftContour(node);
      const rightContour = TreeNode.getRightContour(leftSibling);
      const depth = Math.min(rightContour.length, leftContour.length);

      for (let d = 0; d < depth; d++) {
        const distance = leftContour[d][1] - rightContour[d][1];
        if (distance < minDistance) {
          const shift =
            distance < 0
              ? Math.abs(distance) + minDistance
              : minDistance - distance;
          node.X += shift;
          node.mod += shift;

          leftContour = TreeNode.getLeftContour(node); // make adjusted comparison further level down
          TreeNode.centerNodesBetween(leftSibling, node);
        }
      }
      leftSibling = leftSibling.getNextSibling();
    }
  }

  // only shifts after checking shift for all depths of a sibling
  static checkConflicts2(node: TreeNode) {
    const minDistance = TreeNode.NODE_SIZE + TreeNode.TREE_DISTANCE;

    let leftSibling = node.getLeftMostSibling();
    while (leftSibling && leftSibling !== node) {
      let shiftValue = 0; // only shift after u find the max shift distance for each level of sibling

      const leftContour = TreeNode.getLeftContour(node);
      const rightContour = TreeNode.getRightContourWithSpouse(leftSibling);
      const depth = Math.min(leftContour.length, rightContour.length);

      for (let d = 1; d < depth; d++) {
        const distance = leftContour[d][1] - rightContour[d][1];
        if (distance + shiftValue < minDistance) {
          shiftValue = Math.max(minDistance - distance, shiftValue); // aggregate the max shift value for each level of this sibling
        }
      }

      if (shiftValue) {
        node.X += shiftValue;
        node.mod += shiftValue;
        // you center each time b/c you want to recalculate the next
        // leftSibling's rightContour after centering
        TreeNode.centerNodesBetween(leftSibling, node);
      }

      leftSibling = leftSibling.getNextSibling();
    }
  }

  static centerNodesBetween(leftNode: TreeNode, rightNode: TreeNode) {
    const leftIndex = leftNode.parent?.children.indexOf(leftNode) || 0;
    const rightIndex = rightNode.parent?.children.indexOf(rightNode) || 0;

    const numNodesInBetween = rightIndex - leftIndex - 1;
    if (numNodesInBetween > 0) {
      const distanceBetweenNodes =
        (rightNode.X - leftNode.X) / (numNodesInBetween + 1);
      let count = 1;
      for (let i = leftIndex + 1; i < rightIndex; i++) {
        const middleNode = leftNode.parent!.children[i]!;

        const desiredX = leftNode.X + distanceBetweenNodes * count;
        const offset = desiredX - middleNode.X;

        middleNode.X += offset;
        middleNode.mod += offset;

        count++;
      }

      TreeNode.checkConflicts2(rightNode);
    }
  }

  // level order traversal of leftmost node's X positions w/ modifier added
  // this is used to adjust siblings collisions, we do not alter the node's X value yet
  static getLeftContour(node: TreeNode) {
    const contour: [TreeNode, calculatedX: number][] = [];
    const queue: [TreeNode, level: number, modSum: number][] = [[node, 0, 0]];
    let nextLevel = 0;

    while (queue.length) {
      const [n, level, modSum] = queue.splice(0, 1)[0];
      if (level === nextLevel) {
        nextLevel += 1;
        contour.push([n, n.X + modSum]);
      }

      for (const child of n.children) {
        queue.push([child, level + 1, modSum + n.mod]);
      }
    }

    return contour;
  }

  // level order traversal of rightmost node's X positions w/ modifier added
  // this is used to adjust siblings collisions, we do not alter the node's X value yet
  static getRightContour(node: TreeNode) {
    const contour: [TreeNode, calculatedX: number][] = [];
    const queue: [TreeNode, level: number, modSum: number][] = [[node, 0, 0]];
    let nextLevel = 0;

    while (queue.length) {
      const [n, level, modSum] = queue.splice(0, 1)[0];
      if (level === nextLevel) {
        nextLevel += 1;
        contour.push([n, n.X + modSum]);
      }

      for (const child of n.children.slice().reverse()) {
        queue.push([child, level + 1, modSum + n.mod]);
      }
    }

    return contour;
  }

  // same as @getRightContour, accounts for spouse being part of the contour
  static getRightContourWithSpouse(node: TreeNode) {
    const contour: [TreeNode, calculatedX: number][] = [];
    const queue: [TreeNode, level: number, modSum: number][] = [[node, 0, 0]];
    let nextLevel = 0;

    while (queue.length) {
      const [n, level, modSum] = queue.splice(0, 1)[0];
      if (level === nextLevel) {
        nextLevel += 1;
        const p: [TreeNode, calculatedX: number] = n.spouse
          ? [n.spouse, n.X + modSum + TreeNode.COUPLE_DISTANCE]
          : [n, n.X + modSum];
        contour.push(p);
      }

      for (const child of n.children.slice().reverse()) {
        queue.push([child, level + 1, modSum + n.mod]);
      }
    }

    return contour;
  }

  // if a node falls off the screen, shift nodes so it's visible
  static ensureChildrenOnScreen(node: TreeNode) {
    const leftContour = TreeNode.getLeftContour(node);
    let shiftAmount = 0;

    for (const [, x] of leftContour) {
      shiftAmount = Math.min(shiftAmount, x);
    }

    if (shiftAmount < 0) {
      node.X += Math.abs(shiftAmount);
      node.mod += Math.abs(shiftAmount);
    }
  }

  static finalizeX(node: TreeNode, modSum: number) {
    node.X += modSum;
    modSum += node.mod;

    // adds the spousal distance for every node that has a spouse
    if (node.spouse) {
      node.spouse.X = node.X + TreeNode.COUPLE_DISTANCE;
    }

    for (const child of node.children) {
      TreeNode.finalizeX(child, modSum);
    }
  }

  static levelOrderTraversal(node: TreeNode) {
    const queue: [TreeNode, number][] = [[node, 0]];
    const traversal: [TreeNode, number][] = [];

    while (queue.length) {
      const [curr, level] = queue.splice(0, 1)[0];
      traversal.push([curr, level]);

      if (curr.spouse) {
        traversal.push([curr.spouse, level]);
      }

      for (const child of curr.children) {
        queue.push([child, level + 1]);
      }
    }

    return traversal;
  }

  static removeSpouse(mainNode: TreeNode) {
    mainNode.spouse = null;
  }

  static addSpouse(mainNode: TreeNode, spouseName: string) {
    const spouseNode = new TreeNode(spouseName, [], null, {});
    mainNode.spouse = spouseNode;
    spouseNode.isSpouse = true;
    spouseNode.parent = mainNode;
  }

  static updateSpouse(mainNode: TreeNode, spouseName: string) {
    if (mainNode.spouse) {
      mainNode.spouse.name = spouseName;
    } else {
      const spouseNode = new TreeNode(spouseName, []);
      spouseNode.isSpouse = true;
      spouseNode.parent = mainNode;
      mainNode.spouse = spouseNode;
    }
  }

  static updateName(nodeToUpdate: TreeNode, newName: string) {
    nodeToUpdate.name = newName;
  }

  static updatePersonData(nodeToUpdate: TreeNode, newPersonData: PersonData) {
    nodeToUpdate.personData = { ...newPersonData };
  }

  // returns a string representation of a family tree
  static serializeTree(node: TreeNode): string {
    function stringify(n: TreeNode) {
      if (n === null) return '';

      let s = '';
      // Include name and spouse
      s += n.name + (n.spouse !== null ? ':' + n.spouse.name : '');

      // Add person data fields with | separator
      const dataFields: string[] = [];
      if (n.personData?.nickname)
        dataFields.push(`nick=${n.personData.nickname}`);
      if (n.personData?.birthDate)
        dataFields.push(`birth=${n.personData.birthDate}`);
      if (n.personData?.deathDate)
        dataFields.push(`death=${n.personData.deathDate}`);
      if (n.personData?.occupation)
        dataFields.push(`occ=${n.personData.occupation}`);
      if (n.personData?.location)
        dataFields.push(`loc=${n.personData.location}`);
      if (n.personData?.bio) dataFields.push(`bio=${n.personData.bio}`);
      if (n.personData?.profilePicture)
        dataFields.push(`pic=${n.personData.profilePicture}`);

      if (dataFields.length > 0) {
        s += '|' + dataFields.join('|');
      }
      s += ':::'; // Use ::: as separator instead of comma

      for (const child of n.children) {
        s += stringify(child);
      }
      s += '#:::'; // end this level with :::
      return s;
    }

    return stringify(node).slice(0, -3); // remove the excess :::
  }

  // constructs a TreeNode from the string representation of serializeTree
  static deserializeTree(s: string): TreeNode | null {
    const items = s.split(':::'); // Split by ::: instead of comma
    let i = 0; // iterator

    function rebuild(): TreeNode | null {
      if (i === items.length) return null;

      // Parse the item which may contain name:spouse|field=value|field=value
      const parts = items[i].split('|');
      const nameSpousePart = parts[0];

      const splitted = nameSpousePart.split(':');
      const nodeName = splitted[0];
      const spouseName = splitted.length > 1 ? splitted[1] : null;

      // Parse person data fields
      const personData: PersonData = {};
      for (let j = 1; j < parts.length; j++) {
        const [key, ...valueParts] = parts[j].split('=');
        const value = valueParts.join('='); // Handle = in values
        if (key === 'nick') personData.nickname = value;
        else if (key === 'birth') personData.birthDate = value;
        else if (key === 'death') personData.deathDate = value;
        else if (key === 'occ') personData.occupation = value;
        else if (key === 'loc') personData.location = value;
        else if (key === 'bio') personData.bio = value;
        else if (key === 'pic') personData.profilePicture = value;
      }

      const spouseNode =
        spouseName !== null ? new TreeNode(spouseName, [], null, {}) : null;

      const node = new TreeNode(
        nodeName,
        [],
        spouseNode,
        Object.keys(personData).length > 0 ? personData : undefined,
      );

      if (spouseNode !== null) {
        spouseNode.isSpouse = true;
        spouseNode.parent = node;
      }

      i += 1;

      while (i < items.length && items[i] !== '#') {
        node.children.push(rebuild()!); // keep adding children for root node
      }

      i += 1;
      return node;
    }

    return rebuild();
  }

  static serializeTreeJSON(node: TreeNode): string {
    function convert(n: TreeNode): {
      name: string;
      personData: PersonData;
      spouse: string | null;
      children: ReturnType<typeof convert>[];
    } {
      return {
        name: n.name,
        personData: n.personData,
        spouse: n?.spouse?.name || null,
        children: n?.children.map(convert) || [],
      };
    }
    return JSON.stringify(convert(node));
  }

  static deserializeTreeJSON(serialization: string): TreeNode {
    const simpleObject = JSON.parse(serialization);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function rebuild(obj: any): TreeNode {
      const node = new TreeNode(obj.name, [], null, obj.personData);

      if (obj.spouse) {
        const spouseNode = new TreeNode(obj.spouse, []);
        spouseNode.isSpouse = true;
        spouseNode.parent = node;
        node.spouse = spouseNode;
      }

      node.children = obj.children?.map(rebuild) || [];
      return node;
    }

    return rebuild(simpleObject);
  }

  isLeafNode() {
    return this.children.length == 0;
  }

  // Helper methods for person data
  hasFullInfo(): boolean {
    return !!(
      this.personData.birthDate ||
      this.personData.deathDate ||
      this.personData.occupation ||
      this.personData.location
    );
  }

  getInitials(): string {
    if (!this.name) return '?';
    const parts = this.name.split(' ');
    return parts
      .map((p) => p[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  getSpouseName(): string {
    if (this.isSpouse) {
      return this.parent!.getDisplayName();
    } else if (this.spouse) {
      return this.spouse.getDisplayName();
    }
    return '';
  }

  getDescendantName(descendantKey: string) {
    if (this.children.length !== 0) {
      return this.children.find((c) => c.name === descendantKey)?.name || '';
    }
    return '';
  }

  getAge(): number | null {
    if (!this.personData.birthDate) return null;
    const birthYear = parseInt(this.personData.birthDate.split('-')[0]);
    if (this.personData.deathDate) {
      const deathYear = parseInt(this.personData.deathDate.split('-')[0]);
      return deathYear - birthYear;
    }
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  }

  getFormattedLifespan(): string | null {
    if (!this.personData.birthDate) return null;
    const birthYear = parseInt(this.personData.birthDate.split('-')[0]);
    if (this.personData.deathDate) {
      const deathYear = parseInt(this.personData.deathDate.split('-')[0]);
      return `${birthYear} - ${deathYear} (${deathYear - birthYear})`;
    }
    return `b. ${birthYear} (${new Date().getFullYear() - birthYear})`;
  }

  getDisplayName(): string {
    return this.personData.nickname || this.name;
  }

  // Truncation helpers for fixed dimensions
  getTruncatedDisplayName(maxLength = 18): string {
    const displayName = this.getDisplayName();
    return displayName.length > maxLength
      ? displayName.substring(0, maxLength - 3) + '...'
      : displayName;
  }

  getOccupation(): string {
    return this.personData.occupation || '';
  }

  getTruncatedOccupation(maxLength = 15): string {
    const occupation = this.personData.occupation || '';
    return occupation.length > maxLength
      ? occupation.substring(0, maxLength - 3) + '...'
      : occupation;
  }

  getBirthday(): string {
    return this.personData.birthDate || '';
  }

  getDeathday(): string {
    return this.personData.deathDate || '';
  }

  getLocation(): string {
    return this.personData.location || '';
  }

  getBio(): string {
    return this.personData.bio || '';
  }

  getRightMostChildNode() {
    return this.children.slice(-1)[0];
  }

  getLeftMostChildNode() {
    return this.children[0];
  }

  getPreviousSibling() {
    return this.previousSibling;
  }

  getNextSibling() {
    return this.nextSibling;
  }

  getLeftMostSibling() {
    return this.parent ? this.parent.children[0] : null;
  }

  getRightMostSibling() {
    if (this.parent) {
      const l = this.parent.children.length;
      return this.parent.children[l - 1];
    }
    return null;
  }
}
