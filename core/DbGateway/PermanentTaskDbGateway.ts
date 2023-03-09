import {
  ActivityAddRequest,
  ActivityEditRequest,
  ActivityResponse,
} from "../activity/index"

export default interface PermanentTaskDbGateway {
  edit: (id: number, data: ActivityEditRequest) => void
  editPriority: (id: number, priority: number) => void
  getAll: () => Promise<ActivityResponse[]>
  add: (activity: ActivityAddRequest) => Promise<number>
  delete: (id: number) => void
  toggle: (id: number) => void
}
