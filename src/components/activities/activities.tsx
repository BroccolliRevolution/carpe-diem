import styled from "@emotion/styled"
import { Button, Grid, Link, TextField } from "@mui/material"
import RestartAltIcon from "@mui/icons-material/RestartAlt"

import { useCallback, useMemo, useRef, useState } from "react"
import { formatDate, today } from "../common/dateTime"
import ActivityItem from "./activity-item"
import UseActivities, { Activity } from "./useActivities"

export const Activities = () => {
  const {
    activities,
    addActivity,
    editActivity,
    deleteActivity,
    checkActivity,
    repeatActivityToday,
    bulkRepeatToday,
  } = UseActivities()
  const [title, setTitle] = useState("")
  const titleText = useRef(null)

  const saveActivity = () => {
    const activity = { title }
    addActivity(activity)
    setTitle("")
  }

  type ActivitiesGroupedByDate = { date: string; activities: Activity[] }[]

  // TODO @Peto: maybe useCallback and useMemo in this component

  const groupActivities = useCallback((activities: Activity[]) => {
    return activities
      .map((a) => ({
        ...a,
        date: formatDate(a.done_at ?? a.created_at),
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
  }, [])

  console.log("RERENDER")

  const activitiesDone = useMemo(
    () => groupActivities(activities.filter((a) => a.done)),
    [activities, groupActivities]
  )
  const activitiesNotDone = useMemo(
    () => groupActivities(activities.filter((a) => !a.done)),
    [activities, groupActivities]
  )

  const editPriority = (activity: Activity, direction: "UP" | "DOWN") => {
    // debugger
    const index = activitiesNotDone[0].activities.indexOf(activity)
    const indexColliding = direction === "UP" ? index - 1 : index + 1
    if (indexColliding < 0) return
    if (indexColliding >= activitiesNotDone[0].activities.length) return
    const collidingActivity = activitiesNotDone[0].activities[indexColliding]
    if (direction === "UP") {
      editActivity({
        activity: collidingActivity,
        activityData: {
          id: collidingActivity.id,
          priority: activity.priority,
        },
      })
      editActivity({
        activity,
        activityData: {
          id: activity.id,
          priority: collidingActivity.priority,
        },
      })
    }
    if (direction === "DOWN") {
      editActivity({
        activity: collidingActivity,
        activityData: {
          id: collidingActivity.id,
          priority: activity.priority,
        },
      })
      editActivity({
        activity,
        activityData: {
          id: activity.id,
          priority: collidingActivity.priority,
        },
      })
    }
  }

  const ActivitiesList = ({
    activities,
  }: {
    activities: ActivitiesGroupedByDate
  }) => {
    const [showMore, setShowMore] = useState(false)

    const displayDate = (date: string) => {
      const todaysDate = today()
      return date === todaysDate ? "Today" : date
    }

    return (
      <>
        {activities.map((a, i) => {
          return (
            <>
              {i > 0 && (
                <Link
                  onClick={(e) => {
                    e.preventDefault()
                    setShowMore(!showMore)
                  }}
                  href="#"
                >
                  {showMore ? "Show Less" : "Show More Days"}
                </Link>
              )}
              <div
                key={a.date}
                style={{ display: i > 0 && !showMore ? "none" : undefined }}
              >
                <div
                  style={{ display: "flex", height: 60, alignItems: "center" }}
                >
                  <h5 style={{ marginRight: 20 }}>{displayDate(a.date)}</h5>{" "}
                  {i > 0 && (
                    <Button
                      variant="outlined"
                      onClick={() => {
                        const activitiesToRepeat = activities[i]
                        bulkRepeatToday(activitiesToRepeat.activities)
                      }}
                    >
                      <RestartAltIcon />
                    </Button>
                  )}
                </div>
                <ul style={{ listStyleType: "none", padding: 0 }}>
                  {a.activities.map((activity: Activity) => (
                    <ActivityItem
                      key={activity.id}
                      activity={activity}
                      checkActivity={checkActivity}
                      deleteActivity={deleteActivity}
                      editActivity={editActivity}
                      repeatActivityToday={repeatActivityToday}
                      editPriority={editPriority}
                      checkable={i < 2}
                    ></ActivityItem>
                  ))}
                </ul>
              </div>
            </>
          )
        })}
      </>
    )
  }

  return (
    <GridStyled container spacing={3} height={"100%"}>
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
          <ActivitiesList activities={activitiesNotDone}></ActivitiesList>
        </Grid>
      </Grid>
      <Grid item xs={12} md={5} lg={5}>
        <h3>Daily Log</h3>
        <ActivitiesList activities={activitiesDone}></ActivitiesList>
      </Grid>
    </GridStyled>
  )
}

const GridStyled = styled(Grid)`
  @media (min-width: 600px) {
    padding: 20px;
  }
`
