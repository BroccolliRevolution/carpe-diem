import { DailyAddRequest, DailyEditRequest, DailyResponse } from "core/daily"

export default interface DailiesDbGateway {
  edit: (id: number, data: DailyEditRequest) => void
  editPriority: (id: number, priority: number) => void
  all: () => Promise<DailyResponse[]>
  add: (daily: DailyAddRequest) => Promise<number>
  delete: (id: number) => void
  toggle: (id: number) => void
}
