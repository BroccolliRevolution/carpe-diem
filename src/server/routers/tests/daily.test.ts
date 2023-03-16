import { seeds } from "./daily.fixture"
/**
 * Integration tests for the `daily` router
 */

import { DailyAddData } from "@/utils/api-types"
import { inferProcedureInput } from "@trpc/server"
import { createContextInner } from "../../context"
import { appRouter, AppRouter } from "../_app"

const getCaller = async () => {
  const ctx = await createContextInner({})
  return appRouter.createCaller(ctx)
}

let toCleanup = [] as number[]
const seed = async () => {
  const caller = await getCaller()

  const ids = await Promise.all(
    seeds.map(async (s) => {
      const { id } = await caller.daily.add(s)
      return id
    })
  )
  toCleanup = ids
}
const cleanup = async () => {
  const caller = await getCaller()

  await await Promise.all(
    toCleanup.map(async (id) => {
      try {
        await caller.daily.delete(id)
      } catch (e) {
        // trying to delete what is not there (this is needed for delete test case - after seed, we already deleted that one daily)
      }
    })
  )
}

describe.only("Activities", () => {
  beforeAll(() => {})
  beforeEach(async () => {
    await seed()
  })
  afterEach(async () => {
    await cleanup()
  })
  test.only("add new daily", async () => {
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

    const title = seeds[0].title
    const toDelete = await caller.daily.byTitle(title)
    expect(toDelete).not.toBeFalsy()

    await caller.daily.delete(toDelete?.id as number)

    const error = `No daily with title '${title}'`

    // found here: https://tinyurl.com/458kh7fv
    expect(caller.daily.byTitle(title)).rejects.toEqual(
      expect.objectContaining({
        message: error,
      })
    )
  })
})
