import ActivityData from "core/activities/ActivityData"
import DailyLog from "core/daily-log/DailyLog"
import BasicName from "core/types/BasicName"
import Activity from "../core/activities/Activity"
import DbGateway from "../core/DbGateway"
import TempMemoryDatabase from "./TempMemoryDatabase"

class Repository implements DbGateway {
  private db = new TempMemoryDatabase()

  createActivity(data: ActivityData) {
    this.db.createActivity
  }

  getAllActivities() {
    return this.db.getAllActivities()
  }

  getActivity(name: BasicName) {
    return this.db.getActivity(name)
  }

  addActivity(activity: Activity) {
    this.db.addActivity(activity)
  }

  removeActivity(activity: Activity) {
    this.db.removeActivity(activity)
  }

  private retrieveActivityFromDb(activity: Activity) {
    return this.db.activities.find((a) => activity.name === a.name)
  }

  editActivityName(activity: Activity, name: BasicName) {
    const activityFound = this.retrieveActivityFromDb(activity)

    if (activityFound) {
      activityFound.name = name
    }
  }

  editActivityPriority(activity: Activity, priority: number) {
    const activityFound = this.retrieveActivityFromDb(activity)

    if (activityFound) {
      activityFound.priority = priority
    }
  }

  toggleActivityDone(activity: Activity, done: boolean) {
    const activityFound = this.retrieveActivityFromDb(activity)

    if (activityFound) {
      activityFound.done = done
    }
  }

  addToDailyLog(activity: Activity) {
    this.db.addToDailyLog(activity)
  }

  getDailyLogEntries() {
    return this.db.getDailyLogEntries()
  }
}

export default Repository
