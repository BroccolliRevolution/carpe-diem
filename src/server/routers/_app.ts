import { z } from "zod"
import { procedure, router } from "../trpc"
import { dailyRouter } from "./daily"

export const appRouter = router({
  daily: dailyRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
