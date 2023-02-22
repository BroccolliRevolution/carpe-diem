import { prisma } from "@/db"
import TempMemoryDatabase from "application/TempMemoryDatabase"
import Activity from "core/activities/Activity"
import ActivityData from "core/activities/ActivityData"
import DbGateway from "core/DbGateway"
import BasicName from "core/types/BasicName"

class ActivitiesRepository implements DbGateway {
  private db = new TempMemoryDatabase()

  createActivity(data: ActivityData) {
    this.db.createActivity
  }

  async getAllActivities() {
    const activities = await prisma.activities.findMany({
      orderBy: { id: "asc" },
    })

    const res = activities.map(
      (activity) =>
        new Activity(
          new BasicName(activity.title),
          1,
          activity.id,
          "",
          activity.done
        )
    )

    return res
  }

  getActivityByName(name: BasicName) {
    return this.db.getActivityByName(name)
  }

  addActivity(activity: Activity) {
    this.db.addActivity(activity)
  }

  async deleteActivity(activityId: number) {
    await prisma.activities.delete({ where: { id: activityId } })
  }

  editActivityName(activity: Activity, name: BasicName) {
    // const activityFound = this.retrieveActivityFromDb(activity)
    // if (activityFound) {
    //   activityFound.name = name
    // }
  }

  editActivityPriority(activity: Activity, priority: number) {
    // const activityFound = this.retrieveActivityFromDb(activity)
    // if (activityFound) {
    //   activityFound.priority = priority
    // }
  }

  toggleActivityDone(activity: Activity, done: boolean) {
    // const activityFound = this.retrieveActivityFromDb(activity)
    // if (activityFound) {
    //   activityFound.done = done
    // }
  }

  addToDailyLog(activity: Activity) {
    this.db.addToDailyLog(activity)
  }

  getDailyLogEntries() {
    return this.db.getDailyLogEntries()
  }
}

export default ActivitiesRepository
