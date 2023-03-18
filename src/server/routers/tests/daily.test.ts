import { errorMessage } from "./../errors"
import { seeds } from "./daily.fixture"
/**
 * Integration tests for the `daily` router
 */

import { inferProcedureInput } from "@trpc/server"
import { createContextInner } from "../../context"
import { appRouter, AppRouter } from "../_app"
import { Interval, intervals } from "@/core/daily"
import { z } from "zod"

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

  const seedOne = async (title?: string, periodicity?: Interval) => {
    const caller = await getCaller()
    const input: inferProcedureInput<AppRouter["daily"]["add"]> = {
      title: title ?? "default daily test",
      periodicity: periodicity ?? "DAY",
    }

    const { id, all } = await caller.daily.add(input)

    const daily = await caller.daily.byId(id)
    expect(daily).not.toBeFalsy()

    return { id, all, daily }
  }

  describe("add new daily", () => {
    test("wit title and periodicity", async () => {
      const caller = await getCaller()

      const title = "new daily test"
      const periodicity = "DAY"

      const before = await caller.daily.all()
      const lengthBefore = before.length

      const { id, all: after, daily } = await seedOne(title, periodicity)

      const lengthAfter = after.length
      expect(lengthAfter).toBe(lengthBefore + 1)

      expect(daily.title).toBe(title)
      expect(daily.periodicity).toBe(periodicity)

      // cleanup
      await caller.daily.delete(id)
    })

    test("with invalid input", async () => {
      const caller = await getCaller()
      const input: inferProcedureInput<AppRouter["daily"]["add"]> = {
        title: "", // empty title is invalid
        periodicity: "DAY",
      }

      const error = /String must contain at least 1 character/
      expect(caller.daily.add(input)).rejects.toThrowError(error)
    })
  })

  describe("edit daily", () => {
    test("title and periodicity", async () => {
      const caller = await getCaller()

      const { id, all, daily } = await seedOne()

      daily.title = "UPDATED daily title"
      daily.periodicity = "QUARTER"

      expect(daily).not.toBeFalsy()

      await caller.daily.edit({ id, data: daily })

      const edited = await caller.daily.byId(id)

      expect(edited?.title).toBe(daily.title)
      expect(edited?.periodicity).toBe(daily.periodicity)
    })
    test("with invalid input", async () => {
      const caller = await getCaller()

      const { id, daily } = await seedOne()

      daily.title = ""
      daily.periodicity = "__INVALID TEST PERIODICITY__" as Interval // need to force this typing

      expect(daily).not.toBeFalsy()

      await caller.daily.edit({ id, data: daily }).catch((e) => {
        const issues = e.cause.issues

        expect(issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              code: "too_small",
              path: ["data", "title"],
            }),
            expect.objectContaining({
              code: "invalid_enum_value",
              path: ["data", "periodicity"],
            }),
          ])
        )
      })
    })
  })

  test("remove daily", async () => {
    const caller = await getCaller()

    const id = seedsIds[0]
    const toDelete = await caller.daily.byId(id)
    expect(toDelete).not.toBeFalsy()

    await caller.daily.delete(toDelete.id)

    const error = errorMessage.noDailyWithIdFound(id)

    expect(caller.daily.byId(id)).rejects.toThrowError(error)
  })

  // TODO @Peto: test for parents

  // TODO @Peto: setup test database

  //   a few things you could test when getting all dailies:

  // Test that each item in the returned array has the expected properties (e.g. id, title, description, periodicity).
  // Test that the number of items in the returned array matches the number of dailies that you've created in your test database.
  // Test that the returned array is sorted in the correct order (e.g. by creation date).
  test("when asking for all dailies, return correct data", async () => {
    const caller = await getCaller()

    const all = await caller.daily.all()

    expect(all.length).toBeGreaterThan(0)
    const schema = z.object({
      title: z.string(),
      parentId: z.number().nullish(),
      priority: z.number(),
      created_at: z.date(),
      periodicity: z.enum(intervals),
    })

    all.forEach((daily) => {
      expect(daily).toHaveProperty("title")
      expect(daily).toHaveProperty("created_at")
      expect(daily).toHaveProperty("priority")
      expect(daily).toHaveProperty("parentId")
      expect(daily).toHaveProperty("periodicity")

      const parsed = schema.parse(daily)
    })
  })
})
