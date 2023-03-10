import styled from "@emotion/styled"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import { Button, Grid } from "@mui/material"

import { useCallback, useMemo, useState } from "react"
import { formatDate, today } from "../common/dateTime"
import ActivityItem from "./activity-item"
import { ButtonLink } from "../common/ButtonLink"
import { TitleInput } from "./title-input"
import useActivities, { Activity } from "./useActivities"

export const Activities = ({ type }: { type: "done" | "todo" }) => {
  const {
    activities,
    addActivity,
    editActivity,
    deleteActivity,
    checkActivity,
    repeatActivityToday,
    bulkRepeatToday,
    editPriority,
    editPriorityTop,
  } = useActivities()

  type ActivitiesGroupedByDate = { date: string; activities: Activity[] }[]

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

  const activitiesToDisplay = useMemo(
    () =>
      groupActivities(
        activities.filter((a) => (type === "done" ? a.done : !a.done))
      ),
    [activities, groupActivities, type]
  )

  const ActivitiesList = ({
    activities,
  }: {
    activities: ActivitiesGroupedByDate
  }) => {
    const [showMore, setShowMore] = useState(false)

    const displayDate = (date: string) => (date === today() ? "Today" : date)

    return (
      <>
        {activities.map((group, i) => {
          return (
            <div key={i + group.date}>
              <div style={{ display: i > 0 && !showMore ? "none" : undefined }}>
                <div
                  style={{ display: "flex", height: 60, alignItems: "center" }}
                >
                  <h5 style={{ marginRight: 20 }}>{displayDate(group.date)}</h5>{" "}
                  {i > 0 && (
                    <Button
                      variant="outlined"
                      onClick={() => bulkRepeatToday(activities[i].activities)}
                    >
                      <RestartAltIcon />
                    </Button>
                  )}
                </div>
                <ul style={{ listStyleType: "none", padding: 0 }}>
                  {group.activities.map((activity: Activity) => (
                    <ActivityItem
                      key={activity.id + activity.title}
                      activity={activity}
                      checkActivity={checkActivity}
                      deleteActivity={deleteActivity}
                      editActivity={editActivity}
                      repeatActivityToday={repeatActivityToday}
                      editPriority={editPriority}
                      editPriorityTop={editPriorityTop}
                      checkable={i < 2}
                    ></ActivityItem>
                  ))}
                </ul>
              </div>
              {i === 0 && (
                <ButtonLink onClick={(e) => setShowMore(!showMore)}>
                  {showMore ? "Show Less" : "Show More Days"}
                </ButtonLink>
              )}
            </div>
          )
        })}
      </>
    )
  }

  return (
    <div>
      <h3>{type === "todo" ? "Activities" : "Daily Log"}</h3>
      {type === "todo" && (
        <TitleInput onSave={(title) => addActivity({ title })} />
      )}

      <ActivitiesList activities={activitiesToDisplay}></ActivitiesList>
    </div>
  )
}

const GridStyled = styled(Grid)`
  @media (min-width: 600px) {
    padding: 20px;
  }
`
