import "@testing-library/jest-dom"
import { testActivitiesRepo } from "./../../application/db/TestActivitiesRepo"

const firstActivityTitle = "cleanup your room"
const firstActivityPriority = 1
const firstActivityDone = false
const firstActivityDate = Date.now().toLocaleString()

let db = testActivitiesRepo
const addActivity = (
  title = firstActivityTitle,
  priority = firstActivityPriority,
  done = firstActivityDone,
  date = firstActivityDate
) => {
  const activityData = {
    title,
    done,
    priority,
  }
  db.addActivity(activityData)
}

const dbInitAndSeed = () => {
  db.resetDb()
  addActivity()
}

describe("Activities", () => {
  beforeEach(() => {
    dbInitAndSeed()
  })
  test.only("adds one activity - length of the activities increases by 1 and the same activity can be retrieved", async () => {
    const lengthBefore = await allActivitiesCount()
    const name = "test"
    addActivity(name)
    const lengthAfter = await allActivitiesCount()
    expect(lengthAfter).toBe(lengthBefore + 1)
  })
  const allActivitiesCount = async () => {
    return (await db.getAllActivities()).length
  }

  // const expectActivityExists = async (id: number) => {
  //   const activity = await
  //   expect(activity?.title.value).toBe(name)
  // }

  // test("given adding activity with the length too long, error should be thrown", () => {
  //   let nameText = getName()

  //   expect(() => {
  //     new BasicName(nameText)
  //   }).toThrow(`invalid ActivityName value: ${nameText}`)
  //   expect(() => {
  //     new BasicName("")
  //   }).toThrow(`invalid ActivityName value: ${""}`)

  //   function getName() {
  //     const length = BasicName.MAX_LENGTH + 1
  //     let nameText = ""
  //     const char = "a"
  //     for (let index = 1; index <= length; index++) {
  //       nameText += char
  //     }
  //     return nameText
  //   }
  // })

  test("removes 1 activity, activity not present", async () => {
    const activities = await db.getAllActivities()
    const activity = activities[0]

    const lengthBefore = await allActivitiesCount()
    db.deleteActivity(activity.id)
    const lengthAfter = await allActivitiesCount()

    expect(lengthAfter).toBe(lengthBefore - 1)
  })

  const getFirstActivity = async () => {
    const activities = await db.getAllActivities()
    return activities[0]
  }

  test("edit activity properties", async () => {
    let activity = await getFirstActivity()

    expect(activity.title).toEqual(firstActivityTitle)
    const title = "go out a little"
    const priority = 9999
    db.editActivity({ ...activity, title, priority })
    activity = await getFirstActivity()
    expect(activity?.title).toBe(title)
    expect(activity?.priority).toBe(priority)
  })

  // const expectToggleDoneOnCheck = (activity: ActivityEntity) => {
  //   const done = activity.done
  //   new ToggleActivityDone(db, new AddToDailyLog(db)).execute(activity, !done)
  //   expect(activity.done).toBe(!done)
  // }

  test("when toggle activity check (false->true) - activity is done, and vice versa", async () => {
    let activity = await getFirstActivity()
    expect(activity.done).toBe(false)
    db.toggleActivity(activity.id)
    activity = await getFirstActivity()

    expect(activity.done).toBe(true)
    // expectToggleDoneOnCheck(activity)
  })

  // test("when activity is checked, it gets logged to daily log", async () => {
  //   const activity = await getFirstActivity()
  //   const addToDailyLog = new AddToDailyLog(db)
  //   const spy = jest.spyOn(addToDailyLog, "execute")
  //   new ToggleActivityDone(db, addToDailyLog).execute(activity, !activity.done)
  //   expect(spy).toHaveBeenCalled()
  // })

  // test("when activity is checked, daily log entries count increase", async () => {
  //   const countBefore = new GetDailyLogEntries(db).execute().length
  //   expect(countBefore).toBe(0)

  //   const activity = await getFirstActivity()

  //   // TODO @Peto: maybe use just activity and not boolean done as an argument
  //   new ToggleActivityDone(db, new AddToDailyLog(db)).execute(
  //     activity,
  //     !activity.done
  //   )

  //   const countAfter = new GetDailyLogEntries(db).execute().length

  //   expect(countAfter).toBe(countBefore + 1)
  // })
})
