import {
  ActivityAddRequest,
  ActivityEditRequest,
  ActivityResponse,
} from "../activity/index"

interface ActivityDbGateway {
  editActivity: (id: number, data: ActivityEditRequest) => void
  editPriority: (id: number, priority: number) => void
  getAllActivities: () => Promise<ActivityResponse[]>
  addActivity: (activity: ActivityAddRequest) => Promise<number>
  deleteActivity: (id: number) => void
  toggleActivity: (id: number) => void
  repeatActivityToday: (id: number) => void
  bulkRepeatToday: (ids: number[]) => void
}

export default ActivityDbGateway
