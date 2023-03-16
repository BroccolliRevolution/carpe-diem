import { DailyEditRequest, DailyResponse, DailyAddRequest } from "../daily"

export default interface DailiesDbGateway {
  edit: (id: number, data: DailyEditRequest) => void
  editPriority: (id: number, priority: number) => void
  all: () => Promise<DailyResponse[]>
  getById: (id: number) => Promise<DailyResponse | null>
  add: (daily: DailyAddRequest) => Promise<number>
  delete: (id: number) => void
  toggle: (id: number) => void
}
