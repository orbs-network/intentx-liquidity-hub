import { TaskState } from '../lib/status/types/index'

export const isFinalTaskState = (taskState: TaskState): boolean => {
  switch (taskState) {
    case TaskState.ExecSuccess:
    case TaskState.ExecReverted:
    case TaskState.Cancelled:
      return true
    default:
      return false
  }
}
