import { createFiber } from "./ReactFiber"
import { scheduleUpdateFiber } from "./ReactWorkLoop"

function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot
}

ReactDOMRoot.prototype.render = function(children) {
  console.log('children：', children)
  const root = this._internalRoot
  updateContainer(children, root)
}
// 获取根节点的 Fiber 和开始工作
function updateContainer(element, container) {
  const { containerInfo } = container
  const fiber = createFiber(element, {
    // 标签名
    type: containerInfo.nodeName.toLowerCase(),
    stateNode: containerInfo
  })
  // 组件初次渲染
  scheduleUpdateFiber(fiber)
}

function createRoot(container) {
  const root = { containerInfo: container }
  return new ReactDOMRoot(root)
}

export default { createRoot }