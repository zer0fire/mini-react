import { peek, pop, push } from "./minHeap"

let taskQueue = []
let taskIdCounter = 1
// 获取当前时间
export function getCurrentTime() {
  return performance.now()
}

export function scheduleCallback(callback) {
  const currentTime = getCurrentTime()
  const timeout = -1

  const expirationTime = currentTime - timeout
  const newTask = {
    id: taskIdCounter++,
    callback,
    expirationTime,
    sortIndex: expirationTime
  }
  // 加入队列
  push(taskQueue, newTask)
  // 请求调度
  requestHostCallback()
}

// message 执行的任务
export function requestHostCallback() {
  port.postMessage(null)
}
// MessageChannel 用来用宏任务实现执行
const channel = new MessageChannel()
const port = channel.port2
channel.port1.onmessage = function () {
  workLoop()
}

// 执行，取出 taskQueue，目前没写优先级、过期时间判断等等
function workLoop() {
  let currentTask = peek(taskQueue)
  while(currentTask) {
    const callback = currentTask.callback
    currentTask.callback = null
    callback()
    pop(taskQueue)
    currentTask = peek(taskQueue)
  }
}