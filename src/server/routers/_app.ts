import { z } from "zod"
import { procedure, router } from "../trpc"
import { activityRouter } from "./activity"

export const appRouter = router({
  activity: activityRouter,
  healthcheck: procedure.query(() => "yay!"),
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query(({ input }) => {
      return {
        greeting: `WHat up, ${input.text}?!`,
      }
    }),
})

// export type definition of API
export type AppRouter = typeof appRouter
