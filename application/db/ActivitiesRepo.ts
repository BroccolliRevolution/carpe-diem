import { Activity } from "@prisma/client"
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
    return await prisma.$queryRaw`
    SELECT * FROM "Activity" 
    ORDER BY to_char(done_at,'dd/MM/yyyy') DESC, to_char(created_at,'dd/MM/yyyy') DESC, priority DESC, created_at DESC;`
  },
  addActivity: async (activity: ActivityAddRequest) => {
    // TODO @Peto: unit test this -> also use something like Required<Omit<ActivityData, 'id'>>
    // TODO @Peto: maybe check for the type here and throw an error

    const last = await prisma.activity.findFirst({
      where: {
        done: false,
      },
      orderBy: {
        created_at: "desc",
      },
    })
    const a = await prisma.activity.create({
      data: { ...activity, priority: (last?.priority ?? 0) + 1 },
    })
    return a.id
  },
  deleteActivity: async (id: number) => {
    const activity = await prisma.activity.findFirst({
      where: { id },
    })
    await prisma.activity.updateMany({
      where: {
        priority: {
          gt: activity?.priority,
        },
      },
      data: { priority: { decrement: 1 } },
    })
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
        done_at: !activity?.done ? activity?.created_at : null,
      },
    })
  },

  repeatActivityToday: async (id: number) => {
    const activity = await prisma.activity.findFirst({
      where: { id },
    })

    if (!activity) return

    const last = await prisma.activity.findFirst({
      where: {
        done: false,
      },
      orderBy: {
        created_at: "desc",
      },
    })

    // TODO @Peto: maybe copy others as well
    await prisma.activity.create({
      data: {
        priority: (last?.priority ?? 0) + 1,
        done: false,
        done_at: null,
        title: activity.title,
      },
    })

    if (activity.done) return
    await prisma.activity.delete({ where: { id } })
    // await prisma.activity.update({
    //   where: { id },
    //   data: { created_at: new Date(), done: false, done_at: null },
    // })
  },
}
