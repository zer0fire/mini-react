import { createFiber } from "./ReactFiber";
import { isArray, isStringOrNumber, Update } from "./utils";

function placeChild(
  newFiber, lastPlacedIndex, newIndex, shouldTrackSideEffects
) {
  newFiber.index = newIndex
  // 是否初次渲染
  if (!shouldTrackSideEffects) {
    // 上一次插入节点时的位置（指上一次 returnFiber 对应的 DOM 的最远位置）
    return lastPlacedIndex
  }
}

// 处理子节点，协调 Diff
export function reconcileChildren(returnFiber, children) {
  if (isStringOrNumber(children)) {
    return;
  }
  const newChildren = isArray(children) ? children : [children];
  // oldFiber 的头节点
  let oldFiber = returnFiber.alternate?.child;

  let previousNewFiber = null; // 用来防止第一个节点是 null 当情况

  let newIndex = 0;

  let lastPlacedIndex = 0;

  let shouldTrackSideEffects = !!returnFiber.alternate// 用于判断是 returnFiber 初次渲染还是更新 🚕


  // ? 初次渲染
  // *1. 初次渲染
  // *2. 老节点没了，只有新节点
  if (!oldFiber) {
    for (; newIndex < newChildren.length; newIndex++) {
      const newChild = newChildren[newIndex];
      if (newChild == null) { // 去掉 undefined 和 null
        continue
      }

      const newFiber = createFiber(newChild, returnFiber);
      // placeChild 是干什么的？
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIndex, shouldTrackSideEffects)

      // 串起 sibling 节点
      if (previousNewFiber === null) {
        // 如何判断头结点
        returnFiber.child = newFiber;
      } else {
        // console.log(previousNewFiber)
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
    }
  }

  // 如果新节点遍历完了
  // 但是多个还有多个老节点，老节点都要被删除
  if (newIndex === newChildren.length) {
    deleteRemainingChildren(returnFiber, oldFiber);
    return;
  }
}

// 删除多个老节点
function deleteRemainingChildren(returnFiber, currentFiber) {
  let childToDelete = currentFirstChild;
  while (childToDelete) {
    deleteChild(returnFiber, childToDelete);
    childToDelete = childToDelete.sibling;
  }
}

// 节点复用的条件：1. 同一层级下 2. 类型相同 3. key 相同
function sameNode(a, b) {
  return a && b && a.type === b.type && a.key === b.key;
}

function deleteChild(returnFiber, childToDelete) {
  const deletions = returnFiber.deletions;
  if (deletions) {
    returnFiber.deletions.push(childToDelete);
  } else {
    returnFiber.deletions = [childToDelete];
  }
}
