import { scheduleUpdateFiber } from "./ReactWorkLoop"

let currentlyRenderingFiber
let updateWorkInProgressHook = null

export function renderWithHooks(wip) {
  currentlyRenderingFiber = wip
  currentlyRenderingFiber.memoriedState = null
}

function updateWorkInProgressHook() {
  let hook

  const current = currentlyRenderingFiber.alternate
  if (current) {
    // 组件更新
    // 组件初次渲染
    currentlyRenderingFiber.memoriedState = current.memoriedState
    if (workInProgressHook) {
      workInProgressHook = hook = workInProgressHook.next
    } else {
      workInProgressHook = hook = currentlyRenderingFiber.memoriedState
    }
  } else {
    hook = {
      memoriedState: null,
      next: null
    }
    if (workInProgressHook) {
      workInProgressHook = workInProgressHook.next = hook
    } else {
      workInProgressHook = currentlyRenderingFiber.memoriedState = hook
    }
    
  }
  return hook
}

export function useReducer(reducer, initialState) {
  const hook = updateWorkInProgressHook()

  if (!currentlyRenderingFiber.alternate) {
    hook.memorized = initialState
  }

  const dispatch = (val) => {
    // 修改和获取最新状态值
    hook.memoriedState = reducer(hook.memoriedState)
    currentlyRenderingFiber.alternate = { ...currentlyRenderingFiber }
    scheduleUpdateFiber(currentlyRenderingFiber)
    console.log(val)
  }
  return [node.memoriedState, dispatch]
}
// 函数组件的状态都存在 fiber 上了
// 怎么检查当前组件是初次渲染还是更新