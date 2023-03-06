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
    // TODO @Peto: can I use some prisma features like custom fields etc.
    return await prisma.$queryRaw`
    SELECT * FROM "Activity" 
    ORDER BY to_char(done_at,'dd/MM/yyyy') DESC, to_char(created_at,'dd/MM/yyyy') DESC, priority DESC;`
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
