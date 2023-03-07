import {
  ActivityAddRequest,
  ActivityEditRequest,
  ActivityResponse,
} from "../activity/index"

interface ActivityDbGateway {
  editActivity: (data: ActivityEditRequest) => void
  getAllActivities: () => Promise<ActivityResponse[]>
  addActivity: (activity: ActivityAddRequest) => Promise<number>
  deleteActivity: (id: number) => void
  toggleActivity: (id: number) => void
  repeatActivityToday: (id: number) => void
  bulkRepeatToday: (ids: number[]) => void
}

export default ActivityDbGateway
