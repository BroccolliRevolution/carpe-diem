import { Button, Grid, TextField } from "@mui/material"
import dayjs from "dayjs"
import { useRef, useState } from "react"
import ActivityItem from "./activity-item"
import UseActivities, { Activity } from "./useActivities"

const EditActivities = () => {
  const {
    activities,
    addActivity,
    editActivity,
    deleteActivity,
    checkActivity,
  } = UseActivities()
  const [title, setTitle] = useState<string>("")
  const titleText = useRef(null)

  const saveActivity = () => {
    const activity = { title, done: false, priority: 1 }
    addActivity(activity)
    setTitle("")
  }

  const activitiesDone = activities.filter((a) => a.done)
  const activitiesNotDone = activities.filter((a) => !a.done)

  type ActivitiesGroupedByDate = { date: string; activities: Activity[] }[]
  const groupActivities = (activities: Activity[]) => {
    return activities
      .map((a) => ({
        ...a,
        date: dayjs(a.created_at).format("DD.MM.YYYY"),
      }))
      .reduce((prev, curr) => {
        const atDate = prev.find((d) => d.date === curr.date)
        if (!atDate) {
          return [...prev, { date: curr.date, activities: [curr] }]
        }

        const withoutDate = prev.filter((d) => d.date !== curr.date)

        return [
          ...withoutDate,
          { ...atDate, activities: [...atDate.activities, curr] },
        ]
      }, [] as ActivitiesGroupedByDate)
  }

  const Activities = ({
    activities,
  }: {
    activities: ActivitiesGroupedByDate
  }) => {
    return (
      <>
        {activities.map((a) => {
          return (
            <div key={a.date}>
              <h3>{a.date}</h3>
              <ul style={{ listStyleType: "none", padding: 0, minWidth: 500 }}>
                {a.activities.map((activity: Activity) => (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                    checkActivity={checkActivity}
                    deleteActivity={deleteActivity}
                    editActivity={editActivity}
                  ></ActivityItem>
                ))}
              </ul>
            </div>
          )
        })}
      </>
    )
  }

  return (
    <Grid container spacing={3} height={"100%"}>
      <Grid item xs={12} md={7} lg={7}>
        <h3>Activities</h3>
        <Grid container>
          <Grid item xs={7}>
            <TextField
              ref={titleText}
              fullWidth
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              id="outlined-basic"
              label="Outlined"
              variant="outlined"
              onKeyDown={(ev) => {
                if (ev.key === "Enter") {
                  ev.preventDefault()
                  saveActivity()
                }
              }}
            />
          </Grid>

          <Grid item xs={2} alignItems="stretch" style={{ display: "flex" }}>
            <Button onClick={saveActivity} variant="contained">
              +
            </Button>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          alignItems="stretch"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <Activities
            activities={groupActivities(activitiesNotDone)}
          ></Activities>
        </Grid>
      </Grid>
      <Grid item xs={12} md={5} lg={5}>
        <h3>Daily Log</h3>
        <Activities activities={groupActivities(activitiesDone)}></Activities>
      </Grid>
    </Grid>
  )
}

export default EditActivities
