import { errorMessage } from "./../errors"
import { seeds } from "./daily.fixture"
/**
 * Integration tests for the `daily` router
 */

import { inferProcedureInput } from "@trpc/server"
import { createContextInner } from "../../context"
import { appRouter, AppRouter } from "../_app"

const getCaller = async () => {
  const ctx = await createContextInner({})
  return appRouter.createCaller(ctx)
}

let seedsIds = [] as number[]
const seed = async () => {
  const caller = await getCaller()
  seedsIds = await caller.daily.seedTest()
}
const cleanup = async () => {
  const caller = await getCaller()

  await await Promise.allSettled(
    seedsIds.map(async (id) => {
      try {
        await caller.daily.delete(id)
      } catch (e) {
        // trying to delete what is not there (this is needed for delete test case - after seed, we already deleted that one daily)
      }
    })
  )
}

describe.only("Dailies", () => {
  beforeAll(() => {})
  beforeEach(async () => {
    await seed()
  })
  afterEach(async () => {
    await cleanup()
  })

  test("add new daily with invalid input", async () => {
    const caller = await getCaller()
    const input: inferProcedureInput<AppRouter["daily"]["add"]> = {
      title: "", // empty title is invalid
      periodicity: "DAY",
    }

    const error = /String must contain at least 1 character/
    expect(caller.daily.add(input)).rejects.toThrowError(error)
  })

  test("add new daily", async () => {
    const caller = await getCaller()
    const input: inferProcedureInput<AppRouter["daily"]["add"]> = {
      title: "daily test",
      periodicity: "DAY",
    }
    const before = await caller.daily.all()
    const lengthBefore = before.length
    const { id } = await caller.daily.add(input)

    const after = await caller.daily.all()
    const lengthAfter = after.length
    expect(lengthAfter).toBe(lengthBefore + 1)

    const daily = await caller.daily.byId(id)
    expect(daily.title).toBe(input.title)
    expect(daily.periodicity).toBe(input.periodicity)

    // cleanup
    await caller.daily.delete(id)
  })
  test.only("remove daily", async () => {
    const caller = await getCaller()

    const id = seedsIds[0]
    const toDelete = await caller.daily.byId(id)
    expect(toDelete).not.toBeFalsy()

    await caller.daily.delete(toDelete.id)

    const error = errorMessage.noDailyWithIdFound(id)

    expect(caller.daily.byId(id)).rejects.toThrowError(error)
  })
})
