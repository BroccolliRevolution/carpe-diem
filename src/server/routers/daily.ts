/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
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
    .query(async () => {
      return dailiesRepo.all()
    }),
  byId: procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input }) => {
      const { id } = input
      //   const post = await prisma.post.findUnique({
      //     where: { id },
      //     select: defaultPostSelect,
      //   })
      //   if (!post) {
      //     throw new TRPCError({
      //       code: "NOT_FOUND",
      //       message: `No post with id '${id}'`,
      //     })
      //   }
      return "post"
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
      await dailiesRepo.add(input)
      return dailiesRepo.all()
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
