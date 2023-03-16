import { router, procedure } from "../trpc"
import { Interval, Prisma } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { activitiesRepo } from "../../application/db/ActivitiesRepo"
import { dailiesRepo } from "@/application/db/DailiesRepo"
import { appRouter } from "./_app"
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

const functionName = () => {}

export const dailyRouter = router({
  all: procedure
    // .input(
    //   z.object({
    //     limit: z.number().min(1).max(100).nullish(),
    //     cursor: z.string().nullish(),
    //   })
    // )
    .query(async () => dailiesRepo.all()),
  byId: procedure.input(z.number()).query(async ({ input }) => {
    const id = input
    const res = await dailiesRepo.getById(id)

    if (!res) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `No daily with id '${id}'`,
      })
    }
    return res
  }),
  byTitle: procedure.input(z.string().min(1)).query(async ({ input }) => {
    const id = input
    const res = await dailiesRepo.getByTitle(id)

    if (!res) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `No daily with title '${id}'`,
      })
    }
    return res
  }),
  add: procedure
    .input(
      z.object({
        title: z.string().min(1).max(80),
        parentId: z.number().nullish(),

        // TODO @Peto: use enum from core here! not from Prisma!
        periodicity: z.nativeEnum(Interval).nullish(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const id = await dailiesRepo.add(input)
      const all = await dailiesRepo.all()
      return { all, id }
    }),
  seedTest: procedure.mutation(async () => {
    const ids: number[] = await Promise.all(
      seeds.map(async (s) => {
        const id = await dailiesRepo.add(s)
        return id
      })
    )
    return ids
  }),
  delete: procedure.input(z.number()).mutation(async ({ input }) => {
    await dailiesRepo.delete(input)
    // const all = await dailiesRepo.all()
    return await dailiesRepo.all()
  }),
  check: procedure.input(z.number()).mutation(async ({ input: id }) => {
    await dailiesRepo.toggle(id)
    const activities = await activitiesRepo.all()
    const dailies = await dailiesRepo.all()
    return { activities, dailies }
  }),
})
