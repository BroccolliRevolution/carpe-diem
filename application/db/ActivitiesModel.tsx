import { prisma } from "@/db"
import TempMemoryDatabase from "application/TempMemoryDatabase"
import Activity from "core/activities/Activity"
import ActivityData from "core/activities/ActivityData"
import DailyLog from "core/daily-log/DailyLog"
import BasicName from "core/types/BasicName"

class ActivitiesModel {
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

  public getActivity(name: BasicName) {
    return this.activities.find((a) => a.title.toEquals(name)) ?? null
  }

  public async removeActivity(activity: Activity) {
    await prisma.activities.delete({ where: { id: activity.id } })
  }

  public addToDailyLog(activity: Activity) {
    const log = new DailyLog(activity, new Date(), 0)
    this.dailyLogEntries = [...this.dailyLogEntries, log]
  }

  public getDailyLogEntries() {
    return this.dailyLogEntries
  }
}

export default ActivitiesModel
