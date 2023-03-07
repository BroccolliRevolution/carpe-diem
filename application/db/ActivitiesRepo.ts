import { prisma } from "@/db"
import { ActivityAddRequest, ActivityEditRequest } from "core/activity"
import ActivityDbGateway from "core/DbGateway/ActivityDbGateway"
import dayjs from "dayjs"

export const activitiesRepo: ActivityDbGateway = {
  editActivity: async (data: ActivityEditRequest) => {
    await prisma.activity.update({
      where: { id: data.id },
      data,
    })
  },
  getAllActivities: async () => {
    const limitDate = dayjs().subtract(30, "day").format("YYYY-MM-DD")

    return await prisma.$queryRaw`
    SELECT * FROM "Activity" 
    WHERE created_at >= ${limitDate}::date
    ORDER BY done_at DESC, to_char(created_at,'dd/MM/yyyy') DESC, priority DESC;`
  },
  addActivity: async (activity: ActivityAddRequest) => {
    // TODO @Peto: unit test this -> also use something like Required<Omit<ActivityData, 'id'>>
    // TODO @Peto: maybe check for the type here and throw an error

    // TODO @Peto: refator - this is used multiple times here
    const last = await prisma.activity.findFirst({
      where: {
        AND: {
          done: false,
          created_at: {
            gte: new Date(dayjs().format("YYYY-MM-DD")),
          },
        },
      },
      orderBy: {
        priority: "desc",
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

    // TODO @Peto: maybe use this even for update priority!

    // TODO @Peto: extract code like this to use cases + test
    // shift activities
    if (!activity?.done) {
      await prisma.activity.updateMany({
        where: {
          AND: {
            created_at: {
              gte: new Date(dayjs().format("YYYY-MM-DD")),
            },
            priority: {
              lte: activity?.priority,
            },
          },
        },
        data: { priority: { increment: 1 } },
      })
    }

    const last = await prisma.activity.findFirst({
      where: {
        AND: {
          done: false,
          created_at: {
            gte: new Date(dayjs().format("YYYY-MM-DD")),
          },
        },
      },
      orderBy: {
        priority: "desc",
      },
    })

    await prisma.activity.update({
      where: { id },
      data: {
        done: !activity?.done,
        done_at: !activity?.done ? new Date() : null,
        priority: activity?.done ? (last?.priority ?? 0) + 1 : 0,
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
        AND: {
          done: false,
          created_at: {
            gte: new Date(dayjs().format("YYYY-MM-DD")),
          },
        },
      },
      orderBy: {
        priority: "desc",
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
  },
  bulkRepeatToday: async (ids: number[]) => {
    const activities = await prisma.activity.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    })

    const last = await prisma.activity.findFirst({
      where: {
        AND: {
          done: false,
          created_at: {
            gte: new Date(dayjs().format("YYYY-MM-DD")),
          },
        },
      },
      orderBy: {
        priority: "desc",
      },
    })

    const activitiesToCreate = activities.map(
      ({ id, created_at, ...rest }, i) => {
        return {
          ...rest,
          priority: (last?.priority ?? 0) + i + 1,
          done: false,
          done_at: null,
        }
      }
    )

    await prisma.activity.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    })
    await prisma.activity.createMany({
      data: activitiesToCreate,
    })
  },
}
