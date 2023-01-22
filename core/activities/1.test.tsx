import "@testing-library/jest-dom"
import Repository from "application/Repository"

import BasicName from "core/types/BasicName"
import Activity from "./Activity"
import AddActivity from "./AddActivity"
import EditActivity from "./EditActivity"
import GetActivity from "./GetActivity"
import GetAllActivities from "./GetAllActivities"
import ToggleActivityDone from "./ToggleActivityDone"
import RemoveActivity from "./RemoveActivity"
import AddToDailyLog from "core/daily-log/AddToDailyLog"
import GetDailyLogEntries from "core/daily-log/GetDailyLogEntries"

const firstActivityName = "cleanup your room"
const firstActivityPriority = 1

let db: Repository
const seedActivity = (
  db: Repository,
  name = firstActivityName,
  priority = firstActivityPriority
) => {
  const activityName = new BasicName(name)
  const activity = new Activity(activityName, priority, "")
  const addActivity = new AddActivity(db, new GetActivity(db))
  addActivity.execute(activity)
  return activity
}

const dbInitAndSeed = () => {
  db = new Repository()
  seedActivity(db)
}

describe("Activities", () => {
  beforeEach(() => {
    dbInitAndSeed()
  })

  const getActivityByName = (name: string) => {
    const activityName = new BasicName(name)
    const getActivity = new GetActivity(db)
    return getActivity.execute(activityName) as Activity
  }

  test("Can retrieve activity by its name", () => {
    const retrievedActivity = getActivityByName(firstActivityName)
    const name = retrievedActivity?.name.value
    expect(name).toBe(firstActivityName)
  })

  test("Givent incorrect name, activity should not be retrieved", () => {
    const nonExistentNane = "non existing activity"
    const retrievedActivity = getActivityByName(nonExistentNane)

    expect(() => {
      addActivity(firstActivityName)
    }).toThrow(`Activity ${firstActivityName} already exists`)
  })

  const addActivity = (name: string) => {
    const activityName = new BasicName(name)
    const activity = new Activity(activityName, 1, "")
    const addActivity = new AddActivity(db, new GetActivity(db))
    addActivity.execute(activity)
  }

  const expectActivityExists = (name: string) => {
    const activity = getActivityByName(name)
    expect(activity?.name.value).toBe(name)
  }

  const allActivitiesCount = () => {
    const allActivities = new GetAllActivities(db)
    return allActivities.execute().length
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

  test("adds one activity - length of the activities increases by 1 and the same activity can be retrieved", () => {
    const lengthBefore = allActivitiesCount()
    const name = "test"
    addActivity(name)
    const lengthAfter = allActivitiesCount()
    expectActivityExists(name)
    expect(lengthAfter).toBe(lengthBefore + 1)
  })

  test("removes 1 activity, activity not present", () => {
    const activity = getActivityByName(firstActivityName)

    const lengthBefore = allActivitiesCount()
    new RemoveActivity(db).execute(activity)
    const lengthAfter = allActivitiesCount()

    expect(lengthAfter).toBe(lengthBefore - 1)
  })

  test("cannot add a new activity with already existing name (activity name must be unique)", () => {
    expect(() => {
      addActivity(firstActivityName)
    }).toThrow(`Activity ${firstActivityName} already exists`)
  })

  test("edit activity name", () => {
    const activity = getFirstActivity()

    expect(activity.name.value).toEqual(firstActivityName)

    const editedName = new BasicName("go out a little")
    new EditActivity(db).name(activity, editedName)

    expect(activity?.name.value).toBe(editedName.value)
  })

  const getFirstActivity = () => {
    const activity = new GetActivity(db).execute(
      new BasicName(firstActivityName)
    ) as Activity
    expect(activity).not.toBe(null)
    return activity
  }

  test("edit activity priority", () => {
    const activity = getFirstActivity()

    const newPriority = 2
    new EditActivity(db).priority(activity, newPriority)

    const activityChanged = new GetActivity(db).execute(activity.name)

    expect(activityChanged?.priority).toBe(newPriority)
  })

  const expectToggleDoneOnCheck = (activity: Activity) => {
    const done = activity.done
    new ToggleActivityDone(db, new AddToDailyLog(db)).execute(activity, !done)
    expect(activity.done).toBe(!done)
  }

  test("when toggle activity check (false->true) - activity is done, and vice versa", () => {
    const activity = getFirstActivity()
    expect(activity.done).toBe(false)
    expectToggleDoneOnCheck(activity)
  })

  test("when activity is checked, it gets logged to daily log", () => {
    const activity = getFirstActivity()
    const addToDailyLog = new AddToDailyLog(db)
    const spy = jest.spyOn(addToDailyLog, "execute")
    new ToggleActivityDone(db, addToDailyLog).execute(activity, !activity.done)
    expect(spy).toHaveBeenCalled()
  })

  test("when activity is checked, daily log entries count increase", () => {
    const dailyLogEntriesCount = new GetDailyLogEntries(db).execute().length
    expect(dailyLogEntriesCount).toBe(0)

    console.log(dailyLogEntriesCount)

    const activity = getFirstActivity()
    new ToggleActivityDone(db, new AddToDailyLog(db)).execute(
      activity,
      !activity.done
    )

    console.log(dailyLogEntriesCount)
    expect(dailyLogEntriesCount).toBe(dailyLogEntriesCount + 1)
  })
})
