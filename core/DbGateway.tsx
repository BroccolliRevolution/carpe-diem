import Activity from "./activities/Activity"
import DailyLog from "./daily-log/DailyLog"
import BasicName from "./types/BasicName"

interface DbGateway {
  getAllActivities: () => Activity[]
  getActivity: (name: BasicName) => Activity | null
  addActivity: (activity: Activity) => void
  removeActivity: (activity: Activity) => void
  editActivityName: (activity: Activity, name: BasicName) => void
  editActivityPriority: (activity: Activity, priority: number) => void
  toggleActivityDone: (activity: Activity, done: boolean) => void
  addToDailyLog: (task: Activity) => void
  getDailyLogEntries: () => DailyLog[]
}

export default DbGateway
