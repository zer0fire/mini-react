// ! flags
export const NoFlags = /*                      */ 0b00000000000000000000;
export const Placement = /*                    */ 0b0000000000000000000010; // 2
export const Update = /*                       */ 0b0000000000000000000100; // 4
export const Deletion = /*                     */ 0b0000000000000000001000; // 8

export function isStr(s) {
  return typeof s === 'string'
}
export function isStringOrNumber(s) {
  return typeof s === 'string' || typeof s === 'number'
}
export function isFn(fn) {
  return typeof fn === 'function'
}

export function isUndefined(s) {
  return s === undefined
}

export function isArray(arr) {
  return Array.isArray(arr)
}
// 给 node 加上 props
export function updateNode(node, prevVal, nextVal) {
  // 老属性中，没有的删除和解绑
  Object.keys(prevVal).forEach(k => {
    if (k === 'children') {
      if (isStringOrNumber(prevVal[k])) {
        node.textContent = ''
      }
    } else if(k.slice(0, 2) === 'on') {
      const eventName = k.slice(2).toLowerCase()
      node.removeEventListener(eventName, prevVal[k])
    } else {
      if (!(nextVal.hasOwnProperty(k))) {
        node[k] = ''
      }
    }
  })
  // 给到新属性的值
  // style children 等属性也需要特殊处理
  Object.keys(nextVal).forEach(k => {
    if (k === 'children') {
      if (isStringOrNumber(nextVal[k])) {
        node.textContent = nextVal[k]
      }
    } else if(k.slice(0, 2) === 'on') {
      const eventName = k.slice(2).toLowerCase()
      node.addEventListener(eventName, nextVal[k])
    } else {
      node[k] = nextVal[k]
    }
  })
}
