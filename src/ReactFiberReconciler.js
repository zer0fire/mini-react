import { renderWithHooks } from './hooks'
import { reconcileChildren } from './ReactChildFiber'
import { updateNode } from "./utils"
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
  renderWithHooks(wip)
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
