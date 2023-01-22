import ActivityData from "core/activities/ActivityData"
import DailyLog from "core/daily-log/DailyLog"
import Activity from "../core/activities/Activity"
import BasicName from "../core/types/BasicName"

class TempMemoryDatabase {
  public activities: Activity[] = []
  public dailyLogEntries: DailyLog[] = []

  public addActivity(activity: Activity) {
    this.activities = [...this.activities, activity]
  }

  public createActivity(data: ActivityData) {
    return
  }

  public getAllActivities() {
    return this.activities
  }

  public getActivity(name: BasicName) {
    return this.activities.find((a) => a.name.toEquals(name)) ?? null
  }

  public removeActivity(activity: Activity) {
    this.activities = this.activities.filter(
      (a: Activity) => !a.name.toEquals(activity.name)
    )
  }

  public addToDailyLog(activity: Activity) {
    const log = new DailyLog(activity, new Date(), 0)
    this.dailyLogEntries = [...this.dailyLogEntries, log]
  }

  public getDailyLogEntries() {
    return this.dailyLogEntries
  }
}

export default TempMemoryDatabase
