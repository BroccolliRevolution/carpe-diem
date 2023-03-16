/**
 * Integration test example for the `post` router
 */

import { inferProcedureInput } from "@trpc/server"
import { createContextInner } from "../context"
import { appRouter, AppRouter } from "./_app"

test.only("add new daily", async () => {
  const ctx = await createContextInner({})
  const caller = appRouter.createCaller(ctx)
  const input: inferProcedureInput<AppRouter["daily"]["add"]> = {
    title: "daily test",
    periodicity: "DAY",
  }
  const allPosts = await caller.daily.all()
  const lengthBefore = allPosts.length
  const { id } = await caller.daily.add(input)

  const allPostsAfter = await caller.daily.all()
  const lengthAfter = allPostsAfter.length
  expect(lengthAfter).toBe(lengthBefore + 1)

  const post = await caller.daily.byId(id)
  expect(post.title).toBe(input.title)
  expect(post.periodicity).toBe(input.periodicity)

  // cleanup
  await caller.daily.delete(id)
})
