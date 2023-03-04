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
      orderBy: [{ done_at: "desc" }, { created_at: "desc" }],
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
  deleteActivity: async (id: number) => {
    await prisma.activity.delete({ where: { id: id } })
  },
  toggleActivity: async (id: number) => {
    const activity = await prisma.activity.findFirst({
      where: { id },
    })
    await prisma.activity.update({
      where: { id },
      data: {
        done: !activity?.done,
        done_at: !activity?.done ? new Date() : null,
      },
    })
  },

  repeatActivityToday: async (id: number) => {
    await prisma.activity.update({
      where: { id },
      data: { created_at: new Date(), done: false, done_at: null },
    })
  },
}
