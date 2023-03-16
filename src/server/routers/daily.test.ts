/**
 * Integration test example for the `post` router
 */

import { inferProcedureInput } from "@trpc/server"
import { createContextInner } from "../context"
import { appRouter, AppRouter } from "./_app"

test.only("add and get post", async () => {
  const ctx = await createContextInner({})
  const caller = appRouter.createCaller(ctx)
  const input: inferProcedureInput<AppRouter["daily"]["add"]> = {
    title: "hello test",
    periodicity: "DAY",
  }
  const allPosts = await caller.daily.all()
  const lengthBefore = allPosts.length
  const post = await caller.daily.add(input)
  const allPostsAfter = await caller.daily.all()
  const lengthAfter = allPostsAfter.length
  expect(lengthAfter).toBe(lengthBefore + 1)
})
