/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { activitiesRepo } from "../../application/db/ActivitiesRepo"
import { z } from "zod"
import { procedure, router } from "../trpc"

// /**
//  * Default selector for Post.
//  * It's important to always explicitly say which fields you want to return in order to not leak extra information
//  * @see https://github.com/prisma/prisma/issues/9353
//  */
// const defaultPostSelect = Prisma.validator<Prisma.ActivitySelect>()({
//   id: true,
//   title: true,
// });

export const activityRouter = router({
  all: procedure.query(async () => {
    /**
     * For pagination docs you can have a look here
     * @see https://trpc.io/docs/useInfiniteQuery
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/pagination
     */

    // TODO @Peto: pagination here?
    return activitiesRepo.all()
  }),
  byId: procedure
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
  add: procedure
    .input(
      z.object({
        id: z.string().uuid().optional(),
        title: z.string().min(1).max(32),
        text: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      //   const post = await prisma.post.create({
      //     data: input,
      //     select: defaultPostSelect,
      //   })
      return "post"
    }),
})
