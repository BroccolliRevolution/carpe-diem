import ActivityData from "core/activities/ActivityData"
import BasicName from "core/types/BasicName"
import Activity from "../core/activities/Activity"
import DbGateway from "../core/DbGateway"
import TempMemoryDatabase from "./TempMemoryDatabase"

class TestActivitiesRepository implements DbGateway {
  private db = new TempMemoryDatabase()

  createActivity(data: ActivityData) {
    this.db.createActivity
  }

  getAllActivities() {
    return Promise.resolve(this.db.getAllActivities())
  }

  getActivityByName(name: BasicName) {
    const a = this.db.getActivityByName(name)

    return Promise.resolve(a)
  }

  getActivityById(id: number) {
    return Promise.resolve(this.db.getActivityById(id))
  }

  addActivity(activity: Activity) {
    this.db.addActivity(activity)
  }

  deleteActivity(activityId: number) {
    this.db.deleteActivity(activityId)
  }

  private retrieveActivityFromDb(activity: Activity) {
    return this.db.activities.find((a) => activity.title === a.title)
  }

  editActivity(id: number, data: ActivityData) {
    this.db.editActivity(id, data)
  }

  editActivityName(activity: Activity, name: BasicName) {
    const activityFound = this.retrieveActivityFromDb(activity)

    if (activityFound) {
      activityFound.title = name
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

export default TestActivitiesRepository
