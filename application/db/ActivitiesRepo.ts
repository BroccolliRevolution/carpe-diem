import { prisma } from "@/db"
import { ActivityAddRequest, ActivityEditRequest } from "core/activity"
import ActivityDbGateway from "core/DbGateway/ActivityDbGateway"

export const activitiesRepo: ActivityDbGateway = {
  editActivity: async (data: ActivityEditRequest) => {
    await prisma.activity.update({
      where: { id: data.id },
      data,
    })
  },
  getAllActivities: async () => {
    return await prisma.activity.findMany({
      orderBy: { created_at: "desc" },
    })
  },
  getAllDone: async () => {
    return await prisma.activity.findMany({
      where: {
        done: true,
      },
      orderBy: { created_at: "desc" },
    })
  },
  getAllNotDone: async () => {
    return await prisma.activity.findMany({
      where: {
        done: false,
      },
      orderBy: { created_at: "desc" },
    })
  },
  addActivity: async (activity: ActivityAddRequest) => {
    // TODO @Peto: unit test this -> also use something like Required<Omit<ActivityData, 'id'>>
    // TODO @Peto: maybe check for the type here and throw an error
    const a = await prisma.activity.create({ data: activity })
    return a.id
  },
  deleteActivity: async (activityId: number) => {
    await prisma.activity.delete({ where: { id: activityId } })
  },
  toggleActivity: async (activityId: number) => {
    const activity = await prisma.activity.findFirst({
      where: { id: activityId },
    })
    await prisma.activity.update({
      where: { id: activityId },
      data: { done: !activity?.done },
    })
  },
}
