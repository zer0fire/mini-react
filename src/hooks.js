import { scheduleUpdateFiber } from "./ReactWorkLoop"

// 当前正在工作的 Fiber
let currentlyRenderingFiber = null
let workInProgressHook = null

export function renderWithHooks(wip) {
  currentlyRenderingFiber = wip
  currentlyRenderingFiber.memoriedState = null
  workInProgressHook = null
}

function updateWorkInProgressHook() {
  let hook
  // current 老节点，workInProgress 新节点，还未更新上去的节点
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
    // 组件初次渲染
    hook = {
      memoriedState: null,
      next: null
    }
    if (workInProgressHook) {
      // hook.next
      workInProgressHook = workInProgressHook.next = hook
    } else {
      // hook0
      workInProgressHook = currentlyRenderingFiber.memoriedState = hook
    }
    
  }
  return hook
}

function dispatchReducerAction(fiber, hook, reducer, action) {
  // reducer 是自带的，action 是 setState(xxx) 传入的
  if (reducer) {
    hook.memoizedState = reducer(hook.memoizedState)
  } else {
    hook.memoizedState = typeof action === 'function'
    // setState(() => {}) 的情况
      ? action(hook.memoizedState)
    // setState(xxx) 的情况
      : action
  }

  fiber.alternate = {...fiber}
  fiber.sibling = null // 不影响其他的兄弟节点，只更新当前一个函数组件
  // 通过 schedule 更新
  scheduleUpdateFiber(fiber)
}

export function useReducer(reducer, initialState) {
  // 获取当前 hook，即获取 memo 的当前状态
  const hook = updateWorkInProgressHook()

  if (!currentlyRenderingFiber.alternate) {
    hook.memorized = initialState
  }

  const dispatch = dispatchReducerAction.bind(null, currentlyRenderingFiber, hook, reducer)

  return [hook.memoriedState, dispatch]
}
// 函数组件的状态都存在 fiber 上了
// 怎么检查当前组件是初次渲染还是更新

export function useState(initialState) {
  return useReducer(null, initialState)
}

// hooks 的原理就是用 Fiber 去缓存状态，通过链表顺序和全局读取达到顺序执行的目的
