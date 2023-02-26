import { prisma } from "@/db"
import { Activity } from "@prisma/client"
import { ActivityAddRequest, ActivityEditRequest } from "core/activity"
import ActivityDbGateway from "core/DbGateway/ActivityDbGateway"

// TODO @Peto: get rid of import { Activity } from "@prisma/client"
// TODO @Peto: tests shouldn't depend on prisma
const db = testInMemoryDatabase()
export const testActivitiesRepo = {
  editActivity: async (data: ActivityEditRequest) => {
    return Promise.resolve(db.editActivity(data))
  },
  getAllActivities: async () => {
    return Promise.resolve(db.getAllActivities())
  },
  addActivity: async (activity: ActivityAddRequest) => {
    // TODO @Peto: unit test this -> also use something like Required<Omit<ActivityData, 'id'>>
    // TODO @Peto: maybe check for the type here and throw an error
    return await Promise.resolve(db.addActivity(activity))
  },
  deleteActivity: async (activityId: number) => {
    return await Promise.resolve(db.deleteActivity(activityId))
  },
  toggleActivity: async (activityId: number) => {
    const activity = db.getById(activityId) as Activity

    if (activity) {
      activity.done = !activity.done
    }
    return await Promise.resolve(true)
  },
  resetDb: () => {
    db.resetDb()
  },
}

function testInMemoryDatabase() {
  let activities: Activity[] = []
  // const dailyLogEntries: DailyLog[] = []

  function addActivity(activity: ActivityAddRequest) {
    const newActivity = { ...activity, id: activities.length + 1 }

    // TODO @Peto: solve this!
    //@ts-expect-error dasda
    activities = [...activities, newActivity]
    return newActivity.id
  }

  function getAllActivities() {
    return activities
  }

  function editActivity(data: ActivityEditRequest) {
    activities = activities.map((a) =>
      a.id === data.id ? { ...a, ...data } : a
    )
  }

  function deleteActivity(activityId: number) {
    activities = activities.filter((a) => {
      a.id !== activityId
    })
  }

  function getById(activityId: number) {
    return activities.find((a) => a.id === activityId)
  }

  function resetDb() {
    activities = []
  }

  return {
    deleteActivity,
    editActivity,
    getAllActivities,
    addActivity,
    getById,
    resetDb,
  }

  // public addToDailyLog(activity: ActivityData) {
  //   const log = new DailyLog(activity, new Date(), 0)
  //   dailyLogEntries = [...dailyLogEntries, log]
  // }

  // public getDailyLogEntries() {
  //   return dailyLogEntries
  // }
}
