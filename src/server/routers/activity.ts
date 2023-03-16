/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { activitiesRepo } from "../../application/db/ActivitiesRepo"
import { z } from "zod"
import { procedure, router } from "../trpc"
import { TRPCError } from "@trpc/server"

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
    return await activitiesRepo.all()
  }),
  byId: procedure.input(z.number()).query(async ({ input }) => {
    const id = input
    const res = await activitiesRepo.getById(id)

    if (!res) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `No activity with id '${id}'`,
      })
    }
    return res
  }),
  delete: procedure.input(z.number()).mutation(async ({ input: id }) => {
    await activitiesRepo.delete(id)
    return await activitiesRepo.all()
  }),
  topPriority: procedure.input(z.number()).mutation(async ({ input: id }) => {
    await activitiesRepo.topPriority(id)
    return await activitiesRepo.all()
  }),
  check: procedure.input(z.number()).mutation(async ({ input: id }) => {
    await activitiesRepo.toggle(id)
    return await activitiesRepo.all()
  }),

  edit: procedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          title: z.string().min(1).optional(),
          done: z.boolean().optional(),
          priority: z.number().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const { id, data } = input

      await activitiesRepo.edit(id, data)
      return await activitiesRepo.all()
    }),
  editPriority: procedure
    .input(
      z.object({
        id: z.number(),
        priority: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, priority } = input

      await activitiesRepo.editPriority(id, priority)
      return await activitiesRepo.all()
    }),
  repeat: procedure.input(z.number()).mutation(async ({ input: id }) => {
    await activitiesRepo.repeatToday(id)
    return activitiesRepo.all()
  }),
  bulkRepeat: procedure
    .input(z.number().array())
    .mutation(async ({ input: ids }) => {
      await activitiesRepo.bulkRepeatToday(ids)
      return await activitiesRepo.all()
    }),
  add: procedure
    .input(
      z.object({
        title: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const id = await activitiesRepo.add(input)
      const all = await activitiesRepo.all()
      return { all, id }
    }),
})
