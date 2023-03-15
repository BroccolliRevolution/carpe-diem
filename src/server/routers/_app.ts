import { z } from "zod"
import { publicProcedure, router } from "../trpc"
import { activityRouter } from "./activity"
import { dailyRouter } from "./daily"

export const appRouter = router({
  activity: activityRouter,
  daily: dailyRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
