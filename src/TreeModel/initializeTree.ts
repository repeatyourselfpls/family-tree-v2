import { TreeNode } from "./TreeNode"

function execute(rootNode: TreeNode) {

  TreeNode.initializeNodes(rootNode, null, null, null, 0)
  TreeNode.calculateXMod(rootNode)
  TreeNode.finalizeX(rootNode, 0)

  const traversedNodes = TreeNode.levelOrderTraversal(rootNode)
  for (const [n, level] of traversedNodes) {
    console.log(level, n.name, `(${n.X}, ${n.mod})`)
  }
  const positionedNodes = fitToScreen(structuredClone(traversedNodes), width, height)

}

function fitToScreen(
  leveledNodes: [TreeNode, number][], 
  width: number, 
  height: number, 
) {
  const startX = width / 2 - (leveledNodes[0][0].X * SPACING_X)
  const startY = 100
  for (const [n, _] of leveledNodes) {
    n.X = startX + (n.X * SPACING_X)
    n.Y = startY + (n.Y * SPACING_Y)
  }
  return leveledNodes.map(([n, ]) => n)
}

const sam = new TreeNode("sam", [])
const surya = new TreeNode("surya", [])
const d = new TreeNode("d", [])

const XT = new TreeNode("XT", [])
const VQ = new TreeNode("VQ", [sam, surya, d])
const GM = new TreeNode("GM", [])
const FW = new TreeNode("FW", [VQ, XT, GM])

const MF = new TreeNode("MF", [])
const MB = new TreeNode("MB", [])
const HT = new TreeNode("HT", [MF, MB])
const JS = new TreeNode("JS", [])
const GQ = new TreeNode("GQ", [JS])
const SB = new TreeNode("SB", [FW, HT, GQ])

const SP = new TreeNode("SP", [])
const BS = new TreeNode("BS", [SP])

const SH = new TreeNode("SH", [])
const DJ = new TreeNode("DJ", [])
const EI = new TreeNode("EI", [])
const YI = new TreeNode("YI", [SH, DJ, EI])

const LO = new TreeNode("LO", [])
const LE = new TreeNode("LE", [])
const CO = new TreeNode("CO", [])
const WE = new TreeNode("WE", [CO, LE, LO])

const FR = new TreeNode("FR", [])
const AL = new TreeNode("AL", [])
const UM = new TreeNode("UM", [])
const JB = new TreeNode("JB", [])

const KT = new TreeNode("KT", [FR, AL, UM, JB])
const DN = new TreeNode("DN", [])

const KA = new TreeNode("KA", [])
const KX = new TreeNode("KX", [KA])
const QI = new TreeNode("QI", [])
const SE = new TreeNode("SE", [])

const WH = new TreeNode("WH", [])
const BK = new TreeNode("BK", [KX, QI, SE, WH])

const HH = new TreeNode("HH", [WE, YI, KT, DN])
const JW = new TreeNode("JW", [SB, BS, HH, BK])

const TO = new TreeNode("TO", [JW])