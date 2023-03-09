import { prisma } from "@/db"
import { ActivityAddRequest, ActivityEditRequest } from "core/activity"
import ActivityDbGateway from "core/DbGateway/ActivityDbGateway"
import PermanentTaskDbGateway from "core/DbGateway/PermanentTaskDbGateway"
import dayjs from "dayjs"

const today = new Date(dayjs().format("YYYY-MM-DD"))
export const activitiesRepo: PermanentTaskDbGateway = {
  edit: async (id: number, data: ActivityEditRequest) => {
    await prisma.permanentTask.update({
      where: { id },
      data,
    })
  },

  editPriority: async (id: number, priority: number) => {
    const newPriority = priority

    if (newPriority === 0) return

    const task = await prisma.permanentTask.findFirst({
      where: { id },
    })

    if (!task) return
    const oldPriority = task.priority

    if (oldPriority > newPriority) {
      // going down

      const activityMaxPriority = await prisma.activity.aggregate({
        _min: {
          priority: true,
        },
        where: {
          AND: {
            created_at: {
              gte: today,
            },
            done: false,
          },
        },
      })

      const minPriority = activityMaxPriority._min.priority ?? 0

      if (newPriority < minPriority) return

      await prisma.activity.updateMany({
        where: { priority: newPriority },
        data: {
          priority: {
            increment: 1,
          },
        },
      })

      const a = await prisma.activity.update({
        where: {
          id,
        },
        data: {
          priority: {
            decrement: 1,
          },
        },
      })
    } else {
      // going up

      const activityMaxPriority = await prisma.activity.aggregate({
        _max: {
          priority: true,
        },
        where: {
          AND: {
            created_at: {
              gte: today,
            },
            done: false,
          },
        },
      })

      const maxPriority = activityMaxPriority._max.priority ?? 0

      console.log(newPriority, maxPriority)

      if (newPriority > maxPriority) return

      await prisma.activity.updateMany({
        where: { priority: newPriority },
        data: {
          priority: {
            decrement: 1,
          },
        },
      })

      const a = await prisma.activity.update({
        where: {
          id,
        },
        data: {
          priority: {
            increment: 1,
          },
        },
      })
    }
  },
  getAll: async () => {
    const limitDate = dayjs().subtract(30, "day").format("YYYY-MM-DD")

    return await prisma.$queryRaw`
    SELECT * FROM "Activity" 
    WHERE created_at >= ${limitDate}::date
    ORDER BY done_at DESC, to_char(created_at,'dd/MM/yyyy') DESC, priority DESC;`
  },
  add: async (activity: ActivityAddRequest) => {
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
  delete: async (id: number) => {
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
  toggle: async (id: number) => {
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
              gte: today,
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
}
