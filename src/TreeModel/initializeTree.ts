import { TreeNode } from "./TreeNode"

const RADIUS = 50
const SPACING_X = RADIUS * 2 * 2
const SPACING_Y = 150

export function retrieveNodes(rootNode: TreeNode) {
  TreeNode.initializeNodes(rootNode, null, null, null, 0)
  TreeNode.calculateXMod(rootNode)
  TreeNode.finalizeX(rootNode, 0)

  const traversedNodes = fitToScreen(TreeNode.levelOrderTraversal(rootNode))
  return traversedNodes
}

function fitToScreen(
  leveledNodes: [TreeNode, number][],
) {
  const startX = 0
  const startY = 0
  for (const [n,] of leveledNodes) {
    n.positionedX = startX + (n.X * SPACING_X)
    n.positionedY = startY + (n.Y * SPACING_Y)
  }
  return leveledNodes.map(([n,]) => n)
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

export const treeOne = new TreeNode("TO", [JW])

//

const B = new TreeNode("B", [])
const C = new TreeNode("C", [])
const H = new TreeNode("H", [])
const I = new TreeNode("I", [])
const J = new TreeNode("J", [])
const K = new TreeNode("K", [])
const L = new TreeNode("L", [])

const A = new TreeNode("A", [])
const D = new TreeNode("D", [B, C])
const G = new TreeNode("G", [])
const M = new TreeNode("M", [H, I, J, K, L])

const E = new TreeNode("E", [A, D])
const F = new TreeNode("F", [new TreeNode("sd", [])])
const N = new TreeNode("N", [G, M])

export const treeTwo = new TreeNode("O", [E, F, N])