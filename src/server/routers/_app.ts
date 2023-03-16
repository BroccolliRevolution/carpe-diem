import { router } from "../trpc"
import { activityRouter } from "./activity"
import { dailyRouter } from "./daily"

export const appRouter = router({
  daily: dailyRouter,
  activity: activityRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
