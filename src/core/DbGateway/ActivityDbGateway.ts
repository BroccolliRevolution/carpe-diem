import {
  ActivityAddRequest,
  ActivityEditRequest,
  ActivityResponse,
} from "../activity/index"

export default interface ActivityDbGateway {
  edit: (id: number, data: ActivityEditRequest) => void
  editPriority: (id: number, priority: number) => void
  topPriority: (id: number) => void
  all: () => Promise<ActivityResponse[]>
  getById: (id: number) => Promise<ActivityResponse | null>
  add: (activity: ActivityAddRequest) => Promise<number>
  delete: (id: number) => void
  toggle: (id: number) => void
  repeatToday: (id: number) => void
  bulkRepeatToday: (ids: number[]) => void
}
