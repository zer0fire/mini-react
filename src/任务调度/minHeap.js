// 返回堆顶元素
 function peek(heap) {
  return heap.length === 0 ? null : heap[0]
}

// 插入堆
// 1.插入尾部
// 2.往上调整
 function push(heap, node) {
  let index = heap.length
  heap.push(node)
  siftUp(heap, node, index)
}

 function siftUp(heap, node, i) {
  let index = i
  while(index > 0) {
    const parentIndx = (index - 1) >>> 1
    const parent = heap[parentIndx]
    if (compare(parent, heap) > 0) {
      heap[parentIndx] = node
      heap[index] = parent
      index = parentIndx
    } else {
      return;
    }
  }
}
// 删除堆顶元素
// 1. 最后一个元素覆盖堆顶
// 2. 向下调整
 function pop(heap){
  if (heap.length === 0) {
    return null
  }
  const first = heap[0]
  const last = heap.pop()
  
  if (first !== last) {
    heap[0] = last
    siftDown(heap, last, 0)
  }
  return first
}

 function siftDown(heap, node, i) {
  let index = i
  const len = heap.length
  const halfLen = len >> 1
  while(index < halfLen) {
    const leftIndex = (index + 1) * 2 - 1
    const rightIndex = leftIndex + 1
    const left = heap[leftIndex]
    const right = heap[rightIndex]
    
    if (compare(left, node) < 0) {
      // left << node
      //? compare(left, right) ?
      if (rightIndex < len && compare(right, left) < 0) {
        // right 最小
        heap[index] = right
        heap[rightIndex] = node
        index = rightIndex
      } else {
        // 没有 right 节点或是 left 最小
        heap[index] = left
        heap[leftIndex] = node
        index = leftIndex
      }
    } else if (rightIndex < len && compare(right, node) < 0) {
      // right 在完全二叉树中有可能不存在，这里的是 right 存在，且 right 最小
      heap[index] = right
      heap[rightIndex] = node
      index = rightIndex
    } else {
      return
    }
  }
}
// 比较大小，通过 sortIndex 和 id 判断
function compare(a, b) {
  // return a - b
  const diff = a.sortIndex - b.sortIndx
  return diff !== 0 ? diff : a.id - b.id
}

const a = [3, 7, 4, 10, 12, 9, 6, 15, 14]
while(1) {
  if (a.length === 0) {
    break
  }
  console.log('a', peek(a))
  pop(a)
}