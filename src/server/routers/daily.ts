import { intervals } from "@/core/daily"
import { errorMessage } from "./errors"
import { dailiesRepo } from "@/application/db/DailiesRepo"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { activitiesRepo } from "../../application/db/ActivitiesRepo"
import { procedure, router } from "../trpc"
import { seeds } from "./tests/daily.fixture"

// /**
//  * Default selector for Post.
//  * It's important to always explicitly say which fields you want to return in order to not leak extra information
//  * @see https://github.com/prisma/prisma/issues/9353
//  */
// const defaultPostSelect = Prisma.validator<Prisma.ActivitySelect>()({
//   id: true,
//   title: true,
// });

export const dailyRouter = router({
  all: procedure.query(async () => dailiesRepo.all()),
  byId: procedure.input(z.number()).query(async ({ input: id }) => {
    const res = await dailiesRepo.getById(id)

    if (!res) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: errorMessage.noDailyWithIdFound(id),
      })
    }
    return res
  }),
  byTitle: procedure
    .input(z.string().min(1))
    .query(async ({ input: title }) => {
      const res = await dailiesRepo.getByTitle(title)

      if (!res) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: errorMessage.noDailyWithTitleFound(title),
        })
      }
      return res
    }),

  edit: procedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          title: z.string().min(1).max(80),
          parentId: z.number().nullish(),

          // TODO @Peto: use enum from core here! not from Prisma!
          periodicity: z.enum(intervals).nullish(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const { id, data } = input

      await dailiesRepo.edit(id, data)
      return await dailiesRepo.all()
    }),
  add: procedure
    .input(
      z.object({
        title: z.string().min(1).max(80),
        parentId: z.number().nullish(),

        // TODO @Peto: use enum from core here! not from Prisma!
        periodicity: z.enum(intervals).nullish(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const id = await dailiesRepo.add(input)
      const daily = await dailiesRepo.getById(id)
      const all = await dailiesRepo.all()
      return { all, daily }
    }),
  seedTest: procedure.mutation(async () => {
    const ids: number[] = await Promise.all(
      seeds().map(async (s) => {
        const id = await dailiesRepo.add(s)
        return id
      })
    )
    return ids
  }),
  delete: procedure.input(z.number()).mutation(async ({ input }) => {
    await dailiesRepo.delete(input)
    return await dailiesRepo.all()
  }),
  check: procedure.input(z.number()).mutation(async ({ input: id }) => {
    await dailiesRepo.toggle(id)
    const activities = await activitiesRepo.all()
    const dailies = await dailiesRepo.all()
    return { activities, dailies }
  }),
})
