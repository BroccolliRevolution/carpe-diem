import { ActivityAddRequest, ActivityEditRequest } from "@/core/activity"
import ActivityDbGateway from "@/core/DbGateway/ActivityDbGateway"
import dayjs from "dayjs"
import { prisma } from "."

const today = new Date(dayjs().format("YYYY-MM-DD"))
const limitDate = dayjs().subtract(30, "day").format("YYYY-MM-DD")

export const activitiesRepo: ActivityDbGateway = {
  all: async () => {
    return await prisma.$queryRaw`
    SELECT * FROM "Activity" 
    WHERE created_at >= ${limitDate}::date
    ORDER BY done_at DESC, to_char(created_at,'dd/MM/yyyy') DESC, priority DESC;`
  },
  getById: async (id: number) => {
    return prisma.activity.findFirst({ where: { id } })
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
  edit: async (id: number, data: ActivityEditRequest) => {
    await prisma.activity.update({
      where: { id },
      data,
    })
  },
  topPriority: async (id: number) => {
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

    await prisma.activity.updateMany({
      where: {
        created_at: {
          gte: today,
        },
      },
      data: {
        priority: {
          decrement: 1,
        },
      },
    })

    await prisma.activity.update({
      where: {
        id,
      },
      data: {
        priority: activityMaxPriority._max.priority ?? 0,
      },
    })
  },
  editPriority: async (id: number, priority: number) => {
    const newPriority = priority

    if (newPriority === 0) return

    const activity = await prisma.activity.findFirst({
      where: { id },
    })

    if (!activity) return
    const oldPriority = activity.priority

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
  toggle: async (id: number) => {
    const activity = await prisma.activity.findFirst({
      where: { id },
    })

    if (!activity) return

    // TODO @Peto: maybe use this even for update priority!

    // TODO @Peto: extract code like this to use cases + test
    // shift activities
    if (!activity.done) {
      await prisma.activity.updateMany({
        where: {
          AND: {
            created_at: {
              gte: today,
            },
            priority: {
              lte: activity.priority,
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

    // if activity which has being undone is a Goal, then just remove
    const isGoal = await prisma.goal.count({
      where: {
        activities: {
          some: {
            id: activity.id,
          },
        },
      },
    })

    if (isGoal) {
      await prisma.activity.delete({
        where: { id },
      })
      return
    }

    await prisma.activity.update({
      where: { id },
      data: {
        done: !activity.done,
        done_at: !activity.done ? new Date() : null,
        priority: activity.done ? (last?.priority ?? 0) + 1 : 0,
      },
    })
  },

  repeatToday: async (id: number) => {
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
