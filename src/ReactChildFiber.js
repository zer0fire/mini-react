import { createFiber } from "./ReactFiber";
import { isArray, isStringOrNumber, Update } from "./utils";

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
  for (let newIndex = 0; newIndex < newChildren.length; newIndex++) {
    const newChild = newChildren[newIndex];
    const newFiber = createFiber(newChild, returnFiber);
    const same = sameNode(newFiber, oldFiber);
    // 复用属性
    if (same) {
      Object.assign(newFiber, {
        stateNode: oldFiber.stateNode,
        alternate: oldFiber,
        flag: Update,
      });
    }

    if (!same && oldFiber) {
      deleteChild(returnFiber, oldFiber);
    }

    // 移动到下一个
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }
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
