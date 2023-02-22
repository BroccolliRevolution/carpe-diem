import Activity from "./activities/Activity"
import ActivityData from "./activities/ActivityData"
import DailyLog from "./daily-log/DailyLog"
import BasicName from "./types/BasicName"

interface DbGateway {
  editActivity: (id: number, data: ActivityData) => void
  getAllActivities: () => Promise<Activity[]>
  getActivityByName: (name: BasicName) => Promise<Activity | null>
  getActivityById: (id: number) => Promise<Activity | null>
  addActivity: (activity: Activity) => void
  deleteActivity: (activityId: number) => void
  editActivityName: (activity: Activity, name: BasicName) => void
  editActivityPriority: (activity: Activity, priority: number) => void
  toggleActivityDone: (activity: Activity, done: boolean) => void
  addToDailyLog: (task: Activity) => void
  getDailyLogEntries: () => DailyLog[]
}

export default DbGateway
