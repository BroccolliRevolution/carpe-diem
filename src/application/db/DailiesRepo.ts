import { ActivityEditRequest } from "@/core/activity"
import { DailyAddRequest } from "@/core/daily"
import DailiesDbGateway from "@/core/DbGateway/DailiesDbGateway"
import { Interval } from "@prisma/client"
import dayjs from "dayjs"
import { prisma } from "."

const today = new Date(dayjs().format("YYYY-MM-DD"))
export const dailiesRepo: DailiesDbGateway = {
  edit: async (id: number, data: ActivityEditRequest) => {
    await prisma.goal.update({
      where: { id },
      data,
    })
  },
  getById: async (id: number) => {
    return prisma.goal.findFirst({ where: { id } })
  },
  getByTitle: async (title: string) => {
    return prisma.goal.findFirst({ where: { title } })
  },
  editPriority: async (id: number, priority: number) => {
    const newPriority = priority

    if (newPriority === 0) return

    const daily = await prisma.goal.findFirst({
      where: { id },
    })

    if (!daily) return

    // return
    // const oldPriority = daily.priority

    // if (oldPriority > newPriority) {
    //   // going down

    //   const activityMaxPriority = await prisma.activity.aggregate({
    //     _min: {
    //       priority: true,
    //     },
    //     where: {
    //       AND: {
    //         created_at: {
    //           gte: today,
    //         },
    //         done: false,
    //       },
    //     },
    //   })

    //   const minPriority = activityMaxPriority._min.priority ?? 0

    //   if (newPriority < minPriority) return

    //   await prisma.activity.updateMany({
    //     where: { priority: newPriority },
    //     data: {
    //       priority: {
    //         increment: 1,
    //       },
    //     },
    //   })

    //   const a = await prisma.activity.update({
    //     where: {
    //       id,
    //     },
    //     data: {
    //       priority: {
    //         decrement: 1,
    //       },
    //     },
    //   })
    // } else {
    //   // going up

    //   const activityMaxPriority = await prisma.activity.aggregate({
    //     _max: {
    //       priority: true,
    //     },
    //     where: {
    //       AND: {
    //         created_at: {
    //           gte: today,
    //         },
    //         done: false,
    //       },
    //     },
    //   })

    //   const maxPriority = activityMaxPriority._max.priority ?? 0

    //   console.log(newPriority, maxPriority)

    //   if (newPriority > maxPriority) return

    //   await prisma.activity.updateMany({
    //     where: { priority: newPriority },
    //     data: {
    //       priority: {
    //         decrement: 1,
    //       },
    //     },
    //   })

    //   const a = await prisma.activity.update({
    //     where: {
    //       id,
    //     },
    //     data: {
    //       priority: {
    //         increment: 1,
    //       },
    //     },
    //   })
    // }
  },
  all: async () => {
    // @ts-ignore
    const todaysDayOfWeek = dayjs().format("dddd").toUpperCase()

    return await prisma.goal.findMany({
      where: {
        AND: {
          activities: {
            none: {
              done: true,
              done_at: {
                gte: today,
              },
            },
          },
          active: true,
          OR: [
            {
              periodicity: {
                equals: "DAY",
              },
            },
            {
              periodicity: {
                equals: todaysDayOfWeek as Interval,
              },
            },
          ],
        },
      },
      orderBy: {
        priority: "desc",
      },
    })
  },
  add: async (daily: DailyAddRequest) => {
    const last = await prisma.goal.findFirst({
      where: {
        AND: {
          active: true,
          created_at: {
            gte: today,
          },
        },
      },
      orderBy: {
        priority: "desc",
      },
    })
    const a = await prisma.goal.create({
      data: {
        ...daily,
        priority: (last?.priority ?? 0) + 1,
      },
    })
    return a.id
  },
  delete: async (id: number) => {
    const daily = await prisma.goal.findFirst({
      where: { id },
    })
    await prisma.goal.updateMany({
      where: {
        priority: {
          gt: daily?.priority,
        },
      },
      data: { priority: { decrement: 1 } },
    })
    await prisma.goal.delete({ where: { id: id } })
  },
  toggle: async (id: number) => {
    const daily = await prisma.goal.findFirst({
      where: { id },
    })

    if (!daily) return

    await prisma.activity.create({
      data: {
        title: daily.title,
        done: true,
        goalId: daily.id,
        done_at: new Date(),
      },
    })
  },
}
