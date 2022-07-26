import { ClassComponent, Fragment, FunctionComponent, HostText, HostComponent } from "./ReactWorkTags"
import { isFn, isStr, isUndefined, Placement } from "./utils"

export function createFiber(vNode, returnFiber) {
  // console.log(vNode)
  const fiber = {
    // 类型，原生 class function
    type: vNode.type,
    key: vNode.key,
    // 属性，dom 属性或者说 fiber 属性
    props: vNode.props,
    // 原生标签，stateNode 指的 DOM
    // class组件，指的是实例，函数组件不用这个
    stateNode: null,
    // 第一个子 fiber
    child: null,
    sibling: null,
    return: returnFiber,
    flags: Placement,
    alternate: null,
    deletions: null,
    // 老节点
    index: null,
    alternate: null,
    // 函数组件存的是 hook0，类组件存状态值
    memorizedState: null
  }

  // 函数组件 原生标签 类组件，通过 type 值作区分
  const { type } = vNode
  if(isStr(type)) {
    fiber.tag = HostComponent
  } else if (isFn(type)) {
    // TODO: 如何区分类组件和函数组件
    fiber.tag = type.prototype.isReactComponent ? ClassComponent : FunctionComponent
  } else if (isUndefined(type)) {
    fiber.tag = HostText
    fiber.props = { children: vNode }
  } else {
    // Fragment
    fiber.tag = Fragment
  }
  return fiber
}
