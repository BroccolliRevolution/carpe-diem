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

  // TODO @Peto: test this
  public createActivity(data: ActivityData) {
    return
  }

  public getAllActivities() {
    return this.activities
  }

  editActivity(id: number, data: ActivityData) {
    this.activities = this.activities.map((a: Activity) =>
      a.id === id ? new Activity({ ...data, id: a.id }) : a
    )
  }

  public getActivityById(id: number) {
    return this.activities.find((a) => a.id === id) ?? null
  }

  public getActivityByName(name: BasicName) {
    return this.activities.find((a) => a.title.toEquals(name)) ?? null
  }

  public deleteActivity(activityId: number) {
    this.activities = this.activities.filter((a) => {
      a.id !== activityId
    })
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
