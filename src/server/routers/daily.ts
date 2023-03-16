import { router, procedure } from "../trpc"
import { Interval, Prisma } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { activitiesRepo } from "../../application/db/ActivitiesRepo"
import { dailiesRepo } from "@/application/db/DailiesRepo"

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
  add: procedure
    .input(
      z.object({
        title: z.string().min(1).max(80),
        parentId: z.number().nullish(),

        // TODO @Peto: use enum from core here! not from Prisma!
        periodicity: z.nativeEnum(Interval).nullish(),
      })
    )
    .mutation(async ({ input }) => {
      const id = await dailiesRepo.add(input)
      const all = await dailiesRepo.all()
      return { all, id }
    }),
  delete: procedure.input(z.number()).mutation(async ({ input }) => {
    await dailiesRepo.delete(input)
    // const all = await dailiesRepo.all()
    return await dailiesRepo.all()
  }),
  check: procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await dailiesRepo.toggle(input.id)
      const activities = await activitiesRepo.all()
      const dailies = await dailiesRepo.all()
      return { activities, dailies }
    }),
})
