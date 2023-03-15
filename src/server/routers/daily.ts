import { dailiesRepo } from "application/db/DailiesRepo"
import { activitiesRepo } from "application/db/ActivitiesRepo"
/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { router, publicProcedure } from "../trpc"
import { Interval, Prisma } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

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
  all: publicProcedure
    // .input(
    //   z.object({
    //     limit: z.number().min(1).max(100).nullish(),
    //     cursor: z.string().nullish(),
    //   })
    // )
    .query(async () => {
      return dailiesRepo.all()
    }),
  byId: publicProcedure
    .input(
      z.object({
        id: z.string(),
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
  add: publicProcedure
    .input(
      z.object({
        title: z.string().min(1).max(80),
        parentId: z.number().nullish(),

        // TODO @Peto: use enum from core here! not from Prisma!
        periodicity: z.nativeEnum(Interval).nullish(),
      })
    )
    .mutation(async ({ input }) => {
      console.log(input)

      await dailiesRepo.add(input)
      return dailiesRepo.all()
    }),
  check: publicProcedure
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
