import "@testing-library/jest-dom"

import TestActivitiesRepository from "application/TestActivitiesRepository"
import AddToDailyLog from "core/daily-log/AddToDailyLog"
import GetDailyLogEntries from "core/daily-log/GetDailyLogEntries"
import BasicName from "core/types/BasicName"
import Activity from "./Activity"
import ActivityData from "./ActivityData"
import AddActivity from "./AddActivity"
import DeleteActivity from "./DeleteActivity"
import EditActivity from "./EditActivity"
import EditActivityName from "./EditActivityName"
import EditActivityPriority from "./EditActivityPriority"
import GetActivityById from "./GetActivityById"
import GetActivity from "./GetActivityByName"
import GetAllActivities from "./GetAllActivities"
import ToggleActivityDone from "./ToggleActivityDone"

const firstActivityName = "cleanup your room"
const firstActivityPriority = 1
const firstActivityId = 1
const firstActivityDate = Date.now().toLocaleString()

let db: TestActivitiesRepository
const seedActivity = (
  db: TestActivitiesRepository,
  name = firstActivityName,
  priority = firstActivityPriority,
  id = firstActivityId,
  date = firstActivityDate
) => {
  const activity = new Activity({ title: name, priority, id, date })
  const addActivity = new AddActivity(db)
  addActivity.execute(activity)
  return activity
}

const dbInitAndSeed = () => {
  db = new TestActivitiesRepository()
  seedActivity(db)
}

describe("Activities", () => {
  beforeEach(() => {
    dbInitAndSeed()
  })

  const getActivityByName = (name: string) => {
    const activityName = new BasicName(name)
    const getActivity = new GetActivity(db)
    return getActivity.execute(activityName)
  }

  test("Can retrieve activity by its name", async () => {
    const retrievedActivity = await getActivityByName(firstActivityName)
    const name = retrievedActivity?.title.value
    expect(name).toBe(firstActivityName)
  })

  test("Givent incorrect name, activity should not be retrieved", async () => {
    const nonExistentNane = "non existing activity"

    const activity = await getActivityByName(nonExistentNane)
    expect(activity).toBe(null)
  })

  const addActivity = (name: string) => {
    const activity = new Activity({
      title: name,
      date: Date.now().toLocaleString(),
      done: false,
      id: 3,
      priority: 2,
    })
    const addActivity = new AddActivity(db)
    addActivity.execute(activity)
  }

  const expectActivityExists = async (name: string) => {
    const activity = await getActivityByName(name)
    expect(activity?.title.value).toBe(name)
  }

  const allActivitiesCount = async () => {
    const allActivities = await new GetAllActivities(db).execute()
    return allActivities.length
  }

  test("given adding activity with the length too long, error should be thrown", () => {
    let nameText = getName()

    expect(() => {
      new BasicName(nameText)
    }).toThrow(`invalid ActivityName value: ${nameText}`)
    expect(() => {
      new BasicName("")
    }).toThrow(`invalid ActivityName value: ${""}`)

    function getName() {
      const length = BasicName.MAX_LENGTH + 1
      let nameText = ""
      const char = "a"
      for (let index = 1; index <= length; index++) {
        nameText += char
      }
      return nameText
    }
  })

  test("adds one activity - length of the activities increases by 1 and the same activity can be retrieved", async () => {
    const lengthBefore = await allActivitiesCount()
    const name = "test"
    addActivity(name)
    const lengthAfter = await allActivitiesCount()
    expectActivityExists(name)
    expect(lengthAfter).toBe(lengthBefore + 1)
  })

  test("removes 1 activity, activity not present", async () => {
    const activity = await getActivityByName(firstActivityName)

    const lengthBefore = await allActivitiesCount()
    new DeleteActivity(db).execute(activity?.id as number)
    const lengthAfter = await allActivitiesCount()

    expect(lengthAfter).toBe(lengthBefore - 1)
  })

  test("edit activity name", async () => {
    const activity = await getFirstActivity()

    expect(activity.title.value).toEqual(firstActivityName)

    const editedName = new BasicName("go out a little")
    new EditActivityName(db).execute(activity, editedName)

    expect(activity?.title.value).toBe(editedName.value)
  })

  const getFirstActivity = async () => {
    const activity = (await new GetActivityById(db).execute(
      firstActivityId
    )) as Activity

    expect(activity).not.toBe(null)
    return activity
  }

  test("edit activity priority", async () => {
    const activity = await getFirstActivity()

    const newPriority = 2
    new EditActivityPriority(db).execute(activity, newPriority)

    const activityChanged = await new GetActivity(db).execute(activity.title)

    expect(activityChanged?.priority).toBe(newPriority)
  })

  test("given activity data - can edit activity properties", async () => {
    const data: ActivityData = {
      title: "new title here",
      done: false,
      priority: 2,
      date: Date.now().toLocaleString(),
    }

    new EditActivity(db).execute(firstActivityId, data)

    const activity = await getFirstActivity()

    expect(activity.title.value).toBe(data.title)
  })

  const expectToggleDoneOnCheck = (activity: Activity) => {
    const done = activity.done
    new ToggleActivityDone(db, new AddToDailyLog(db)).execute(activity, !done)
    expect(activity.done).toBe(!done)
  }

  test("when toggle activity check (false->true) - activity is done, and vice versa", async () => {
    const activity = await getFirstActivity()
    expect(activity.done).toBe(false)
    expectToggleDoneOnCheck(activity)
  })

  test("when activity is checked, it gets logged to daily log", async () => {
    const activity = await getFirstActivity()
    const addToDailyLog = new AddToDailyLog(db)
    const spy = jest.spyOn(addToDailyLog, "execute")
    new ToggleActivityDone(db, addToDailyLog).execute(activity, !activity.done)
    expect(spy).toHaveBeenCalled()
  })

  test("when activity is checked, daily log entries count increase", async () => {
    const countBefore = new GetDailyLogEntries(db).execute().length
    expect(countBefore).toBe(0)

    const activity = await getFirstActivity()

    // TODO @Peto: maybe use just activity and not boolean done as an argument
    new ToggleActivityDone(db, new AddToDailyLog(db)).execute(
      activity,
      !activity.done
    )

    const countAfter = new GetDailyLogEntries(db).execute().length

    expect(countAfter).toBe(countBefore + 1)
  })
})
