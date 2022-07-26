import { scheduleCallback } from ".";
import { updateClassComponent, updateFragmentComponent, updateFunctionComponent, updateHostComponent, updateHostTextComponent } from "./ReactReconciler";
import { HostComponent, FunctionComponent, ClassComponent, Fragment, HostText } from './ReactWorkTags';
import { Placement, updateNode } from "./utils";

let wip = null // work in progress 当前正在执行的
let wipRoot = null

// 初次渲染和更新
export function scheduleUpdateFiber(fiber) {
  wip = fiber
  wipRoot = fiber

  scheduleCallback(workLoop)
}

function performUnitOfWork() {
  const { tag } = wip

  switch (tag) {
    case HostComponent:
      updateHostComponent(wip)
      break;
    case FunctionComponent:
      updateFunctionComponent(wip)
      break;
    case ClassComponent:
      updateClassComponent(wip)
      break;
    case Fragment:
      updateFragmentComponent(wip)
      break;
    case HostText:
      updateHostTextComponent(wip)
      break;
    default:
      break;
  }

  // 子节点 - 兄弟节点 - 父节点 - 父节点的兄弟节点
  // 深度优先遍历 wip 为 null 认为任务完成
  if (wip.child) {
    wip = wip.child
    return
  }

  let next = wip
  while(next) {
    if (next.sibling) {
      wip = next.sibling
      return
    }
    next = next.return
  }
  wip = null
}

function workLoop() {
  while(wip) {
    performUnitOfWork()
  }
  // 循环完毕，挂载
  if (!wip && wipRoot) {
    commitRoot()
  }
}

// 提交，更新到 DOM
function commitRoot() {
  commitWorker(wipRoot)
  wipRoot = null
}

// 具体更新的方式
function commitWorker(wip) {
  if (!wip) {
    return
  }
  // 1.提交自己
  const { flags, stateNode } = wip
  // stateNode 是不是 DOM 节点（没处理类实例的情况）
  // !????! 如何取到父节点
  // const parentNode = wip.return.stateNode
  // 挂载
  const parentNode = getParentNode(wip)
  if (flags & Placement && stateNode) {
    // 作业：函数组件、类组件
    // DOM 操作？ wipRoot 的节点？parent 哪儿来的？
    parentNode.appendChild(stateNode)
  }
  // 更新
  if (flags & Update && stateNode) {
    updateNode(stateNode, wip.alternate.props, wip.props)
  }
  // 删除
  if (wip.deletions) {
    commitDeletions(wip.deletions, stateNode || parentNode)
  }

  // 2.提交子节点
  commitWorker(wip.child)
  // 3.提交兄弟节点
  commitWorker(wip.sibling)
}
// 串起 sibling 父节点
function getParentNode(wip) {
  let tem = wip.return
  while(tem) {
    // 有没有 DOM 节点
    if (tem.stateNode) {
      return tem.stateNode
    }
    // 从 fiber 上找，一直找到 stateNode，原生 DOM 或 class 实例
    tem = tem.return
  }
}

function commitDeletions(deletions, parentNode) {
  for (let i = 0; i < deletions.length; i++) {
    parentNode.removeChild(getStateNode(deletions[i]))
  }
}
// 不是每个 fiber 都有 DOM 节点
function getStateNode(fiber) {
  let tem = fiber
  while(!tem.stateNode) {
    tem = tem.child
  }
  return tem.stateNode
}


requestIdleCallback(workLoop)