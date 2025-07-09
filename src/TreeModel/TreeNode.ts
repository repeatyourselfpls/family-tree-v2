export class TreeNode {
  static NODE_SIZE = 1
  static SIBLING_DISTANCE = 0
  static TREE_DISTANCE = 0
  static COUPLE_DISTANCE = 1 // should be <= (node_size + sibling_distance) for aesthetics

  name = ''
  children: TreeNode[] = []
  spouse: TreeNode | null = null
  isSpouse: boolean = false
  parent: TreeNode | null = null
  previousSibling: TreeNode | null = null
  nextSibling: TreeNode | null = null
  mod = 0
  X = 0
  Y = -1
  positionedX = -1
  positionedY = -1

  constructor(name: string, children: TreeNode[], spouse: TreeNode | null = null) {
    this.name = name
    this.children = children
    this.spouse = spouse
    if (this.spouse) this.spouse.isSpouse = true
  }

  // Attaches previous siblings and a base Y for each level 
  static initializeNodes(
    node: TreeNode,
    parent: TreeNode | null,
    previousSibling: TreeNode | null,
    nextSibling: TreeNode | null,
    startingY: number
  ) {
    node.mod = 0
    node.positionedX = -1
    node.positionedY = -1
    node.X = 0
    node.Y = startingY
    if (node.spouse) {
      node.spouse.Y = startingY
      node.spouse.X = -1
      node.spouse.mod = -1
      node.spouse.positionedX = -1
      node.spouse.positionedY = -1
    }

    node.previousSibling = previousSibling
    node.nextSibling = nextSibling
    node.parent = parent
    for (let i = 0; i < node.children.length; i++) {
      TreeNode.initializeNodes(
        node.children[i],
        node,
        i > 0 ? node.children[i - 1] : null,
        i < node.children.length ? node.children[i + 1] : null,
        startingY + 1
      )
    }
  }

  // Calculates the X and Mod bottom up
  static calculateXMod(node: TreeNode) {
    for (const child of node.children) {
      TreeNode.calculateXMod(child)
    }

    if (node.isLeafNode()) {
      if (!node.previousSibling) {
        node.X = 0
      } else {
        node.X = node.previousSibling.X + TreeNode.NODE_SIZE + TreeNode.SIBLING_DISTANCE
      }
    } else if (node.children.length == 1) {
      if (!node.previousSibling) {
        node.X = node.getLeftMostChildNode().X
      } else {
        node.X = node.previousSibling.X + TreeNode.NODE_SIZE + TreeNode.SIBLING_DISTANCE
        node.mod = node.X - node.getLeftMostChildNode().X
      }
    } else {
      if (!node.previousSibling) {
        node.X = (node.getLeftMostChildNode().X + node.getRightMostChildNode().X) / 2
      } else {
        node.X = node.previousSibling.X + TreeNode.NODE_SIZE + TreeNode.SIBLING_DISTANCE
        node.mod = node.X - (node.getLeftMostChildNode().X + node.getRightMostChildNode().X) / 2 // currentX - desired
      }
    }

    // check if sibling subtrees clash, adjust X and mod if so
    if (node.children.length) {
      TreeNode.checkConflicts2(node)
    }
  }

  static calculateXModWithSpouseCentered(node: TreeNode) {
    for (const child of node.children) {
      TreeNode.calculateXModWithSpouseCentered(child)
    }

    const minDist = node.previousSibling?.spouse
      ? TreeNode.NODE_SIZE + TreeNode.SIBLING_DISTANCE + TreeNode.COUPLE_DISTANCE
      : TreeNode.NODE_SIZE + TreeNode.SIBLING_DISTANCE

    // the children still determine the current node's position if no previous siblings exist
    if (node.isLeafNode()) {
      if (!node.previousSibling) {
        node.X = 0
      } else {
        node.X = node.previousSibling.X + minDist
      }
    } else if (node.children.length == 1) {
      if (!node.previousSibling) {
        node.X = node.getLeftMostChildNode().X
      } else {
        node.X = node.previousSibling.X + minDist
      }
      // but the modifier for the current node is affected to center children over both spouses
      const center = node.spouse ? (node.X + node.X + TreeNode.COUPLE_DISTANCE) / 2
        : node.X
      node.mod = center - node.getLeftMostChildNode().X // effectively node.X or center
    } else {
      if (!node.previousSibling) {
        node.X = (node.getLeftMostChildNode().X + node.getRightMostChildNode().X) / 2
      } else {
        node.X = node.previousSibling.X + minDist
      }
      // but the modifier for the current node is affected to center children over both spouses
      const center = node.spouse ? (node.X + node.X + TreeNode.COUPLE_DISTANCE) / 2
        : node.X
      node.mod = center - (node.getLeftMostChildNode().X + node.getRightMostChildNode().X) / 2 // currentX - desired
    }

    if (node.children.length) {
      TreeNode.checkConflicts2(node)
    }
  }

  // shifts everytime, but resets the contour after each level shift
  static checkConflicts(node: TreeNode) {
    const minDistance = TreeNode.NODE_SIZE + TreeNode.TREE_DISTANCE
    let leftSibling = node.getLeftMostSibling()
    while (leftSibling && leftSibling != node) {
      let leftContour = TreeNode.getLeftContour(node)
      const rightContour = TreeNode.getRightContour(leftSibling)
      const depth = Math.min(rightContour.length, leftContour.length)

      for (let d = 0; d < depth; d++) {
        const distance = leftContour[d][1] - rightContour[d][1]
        if (distance < minDistance) {
          const shift = distance < 0 ? Math.abs(distance) + minDistance : minDistance - distance
          node.X += shift
          node.mod += shift

          leftContour = TreeNode.getLeftContour(node) // make adjusted comparison further level down
          TreeNode.centerNodesBetween(leftSibling, node)
        }
      }
      leftSibling = leftSibling.getNextSibling()
    }
  }

  // only shifts after checking shift for all depths of a sibling
  static checkConflicts2(node: TreeNode) {
    const minDistance = TreeNode.NODE_SIZE + TreeNode.TREE_DISTANCE

    let leftSibling = node.getLeftMostSibling()
    while (leftSibling && leftSibling !== node) {
      let shiftValue = 0 // only shift after u find the max shift distance for each level of sibling

      const leftContour = TreeNode.getLeftContour(node)
      const rightContour = TreeNode.getRightContourWithSpouse(leftSibling)
      const depth = Math.min(leftContour.length, rightContour.length)

      for (let d = 1; d < depth; d++) {
        const distance = leftContour[d][1] - rightContour[d][1]
        if (distance + shiftValue < minDistance) {
          shiftValue = Math.max(minDistance - distance, shiftValue) // aggregate the max shift value for each level of this sibling
        }
      }

      if (shiftValue) {
        node.X += shiftValue
        node.mod += shiftValue
        // you center each time b/c you want to recalculate the next 
        // leftSibling's rightContour after centering
        TreeNode.centerNodesBetween(leftSibling, node)
      }

      leftSibling = leftSibling.getNextSibling()
    }
  }

  static centerNodesBetween(leftNode: TreeNode, rightNode: TreeNode) {
    const leftIndex = leftNode.parent?.children.indexOf(leftNode) || 0
    const rightIndex = rightNode.parent?.children.indexOf(rightNode) || 0

    const numNodesInBetween = rightIndex - leftIndex - 1
    if (numNodesInBetween > 0) {
      const distanceBetweenNodes = (rightNode.X - leftNode.X) / (numNodesInBetween + 1)
      let count = 1
      for (let i = leftIndex + 1; i < rightIndex; i++) {
        const middleNode = leftNode.parent!.children[i]!

        const desiredX = leftNode.X + (distanceBetweenNodes * count)
        const offset = desiredX - middleNode.X

        middleNode.X += offset
        middleNode.mod += offset

        count++
      }

      TreeNode.checkConflicts2(rightNode)
    }
  }

  // level order traversal of leftmost node's X positions w/ modifier added
  // this is used to adjust siblings collisions, we do not alter the node's X value yet
  static getLeftContour(node: TreeNode) {
    const contour: [TreeNode, calculatedX: number][] = []
    const queue: [TreeNode, level: number, modSum: number][] = [[node, 0, 0]]
    let nextLevel = 0

    while (queue.length) {
      const [n, level, modSum] = queue.splice(0, 1)[0]
      if (level === nextLevel) {
        nextLevel += 1
        contour.push([n, n.X + modSum])
      }

      for (const child of n.children) {
        queue.push([child, level + 1, modSum + n.mod])
      }
    }

    return contour
  }

  // level order traversal of rightmost node's X positions w/ modifier added
  // this is used to adjust siblings collisions, we do not alter the node's X value yet
  static getRightContour(node: TreeNode) {
    const contour: [TreeNode, calculatedX: number][] = []
    const queue: [TreeNode, level: number, modSum: number][] = [[node, 0, 0]]
    let nextLevel = 0

    while (queue.length) {
      const [n, level, modSum] = queue.splice(0, 1)[0]
      if (level === nextLevel) {
        nextLevel += 1
        contour.push([n, n.X + modSum])
      }

      for (const child of n.children.slice().reverse()) {
        queue.push([child, level + 1, modSum + n.mod])
      }
    }

    return contour
  }

  // same as @getRightContour, accounts for spouse being part of the contour
  static getRightContourWithSpouse(node: TreeNode) {
    const contour: [TreeNode, calculatedX: number][] = []
    const queue: [TreeNode, level: number, modSum: number][] = [[node, 0, 0]]
    let nextLevel = 0

    while (queue.length) {
      const [n, level, modSum] = queue.splice(0, 1)[0]
      if (level === nextLevel) {
        nextLevel += 1
        const p: [TreeNode, calculatedX: number] = n.spouse ? [n.spouse, n.X + modSum + TreeNode.COUPLE_DISTANCE]
          : [n, n.X + modSum]
        contour.push(p)
      }

      for (const child of n.children.slice().reverse()) {
        queue.push([child, level + 1, modSum + n.mod])
      }
    }

    return contour
  }

  // if a node falls off the screen, shift nodes so it's visible
  static ensureChildrenOnScreen(node: TreeNode) {
    const leftContour = TreeNode.getLeftContour(node)
    let shiftAmount = 0

    for (const [, x] of leftContour) {
      shiftAmount = Math.min(shiftAmount, x)
    }

    if (shiftAmount < 0) {
      node.X += Math.abs(shiftAmount)
      node.mod += Math.abs(shiftAmount)
    }
  }

  static finalizeX(node: TreeNode, modSum: number) {
    node.X += modSum
    modSum += node.mod

    // adds the spousal distance for every node that has a spouse
    if (node.spouse) {
      node.spouse.X = node.X + TreeNode.COUPLE_DISTANCE
    }

    for (const child of node.children) {
      TreeNode.finalizeX(child, modSum)
    }
  }

  static levelOrderTraversal(node: TreeNode) {
    const queue: [TreeNode, number][] = [[node, 0]]
    const traversal: [TreeNode, number][] = []

    while (queue.length) {
      const [curr, level] = queue.splice(0, 1)[0]
      traversal.push([curr, level])

      if (curr.spouse) {
        traversal.push(([curr.spouse, level]))
      }

      for (const child of curr.children) {
        queue.push([child, level + 1])
      }
    }

    return traversal
  }

  isLeafNode() {
    return this.children.length == 0
  }

  getRightMostChildNode() {
    return this.children.slice(-1)[0]
  }

  getLeftMostChildNode() {
    return this.children[0]
  }

  getPreviousSibling() {
    return this.previousSibling;
  }

  getNextSibling() {
    return this.nextSibling;
  }

  getLeftMostSibling() {
    return this.parent ? this.parent.children[0] : null
  }

  getRightMostSibling() {
    if (this.parent) {
      const l = this.parent.children.length
      return this.parent.children[l - 1]
    }
    return null
  }
}
