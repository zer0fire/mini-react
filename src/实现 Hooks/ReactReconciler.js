import { createFiber } from "./ReactFiber"
import { isArray, isStringOrNumber, Update, updateNode } from "./utils"
// 处理原生标签
export function updateHostComponent(wip) {
  // 更新和生成都走这里
  if (!wip.stateNode) {
    wip.stateNode = document.createElement(wip.type)
    updateNode(wip.stateNode, null, wip.props)
  }
  // 处理子节点
  reconcileChildren(wip, wip.props.children)
}
// 处理函数组件
export function updateFunctionComponent(wip) {
  const { type, props } = wip
  // 这里的 type 是函数组件的函数
  const children = type(props)
  reconcileChildren(wip, children)
}
// 处理类组件
export function updateClassComponent(wip) {
  const { type, props } = wip
  // 这里的 type 是类组件的构造函数
  const instance = new type(props)
  const children = instance.render()
  reconcileChildren(wip, children)
}
// 处理 Fragment
export function updateFragmentComponent(wip) {
  const { props } = wip
  reconcileChildren(wip, props.children)
}
// 处理文本节点
export function updateHostTextComponent(wip) {
  const { props } = wip
  wip.stateNode = document.createTextNode(props.children)
}

// 处理子节点，协调 Diff
function reconcileChildren(wip, children) {
  if (isStringOrNumber(children)) {
    return
  }
  const newChildren = isArray(children) ? children : [children]
  // oldFiber 的头节点
  let oldFiber = wip.alternate?.child

  let previousNewFiber = null // 用来防止第一个节点是 null 当情况
  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i];
    const newFiber = createFiber(newChild, wip)
    const same = sameNode(newFiber, oldFiber)
    // 复用属性
    if (same) {
      Object.assign(newFiber, {
        stateNode: oldFiber.stateNode,
        alternate: oldFiber,
        flag: Update
      })
    }

    if (!same && oldFiber) {
      deleteChild(wip, oldFiber)
    }

    // 移动到下一个
    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }
    // 串起 sibling 节点
    if (previousNewFiber === null) {
      // 如何判断头结点
      wip.child = newFiber
    } else {
      // console.log(previousNewFiber)
      previousNewFiber.sibling = newFiber
    }
    previousNewFiber = newFiber
  }
}

// 节点复用的条件：1. 同一层级下 2. 类型相同 3. key 相同
function sameNode(a, b) {
  return a && b && a.type === b.type && a.key === b.key
}

function deleteChild(returnFiber, childToDelete) {
  const deletions = returnFiber.deletions
  if (deletions) {
    returnFiber.deletions.push(childToDelete)
  } else {
    returnFiber.deletions = [childToDelete]
  }
}