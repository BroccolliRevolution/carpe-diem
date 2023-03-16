import styled from "@emotion/styled"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import { Button, Grid } from "@mui/material"

import { useCallback, useMemo, useState } from "react"
import { formatDate, today } from "../common/dateTime"
import ActivityItem from "./activity-item"
import { ButtonLink } from "../common/ButtonLink"
import useActivities from "./useActivities"
import { TitleInput } from "../common/titleInput"
import { trpc } from "@/utils/trpc"
import { Activity } from "@/utils/api-types"

export const Activities = ({ type }: { type: "done" | "todo" }) => {
  const {
    // activities,
    // addActivity,
    // editActivity,
    // deleteActivity,
    checkActivity,

    // editPriority,
    // editPriorityTop,
  } = useActivities()

  const utils = trpc.useContext()
  const q = trpc.activity.all.useQuery()

  const check = trpc.activity.check.useMutation({
    onSuccess(input) {
      utils.activity.all.setData(undefined, input)
      utils.daily.invalidate()
    },
  }).mutate
  const add = trpc.activity.add.useMutation({
    onSuccess({ all }) {
      utils.activity.all.setData(undefined, all)
    },
  }).mutate
  const edit = trpc.activity.edit.useMutation({
    onSuccess(input) {
      utils.activity.all.setData(undefined, input)
    },
  }).mutate
  const deleteActivity = trpc.activity.delete.useMutation({
    onSuccess(input) {
      utils.activity.all.setData(undefined, input)
    },
  }).mutate
  const editPriorityTop = trpc.activity.topPriority.useMutation({
    onSuccess(input) {
      utils.activity.all.setData(undefined, input)
    },
  }).mutate
  const editPriority = trpc.activity.editPriority.useMutation({
    onSuccess(input) {
      utils.activity.all.setData(undefined, input)
    },
  }).mutate
  const repeatActivityToday = trpc.activity.repeat.useMutation({
    onSuccess(input) {
      utils.activity.all.setData(undefined, input)
    },
  }).mutate
  const bulkRepeatToday = trpc.activity.bulkRepeat.useMutation({
    onSuccess(input) {
      utils.activity.all.setData(undefined, input)
    },
  }).mutate
  // TODO @Peto: fix
  const activities = q.data ?? []
  const loading = q.isLoading

  type ActivitiesGroupedByDate = { date: string; activities: Activity[] }[]

  const groupActivities = useCallback(
    (activities: Activity[]): ActivitiesGroupedByDate => {
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
    },
    []
  )

  const activitiesToDisplay = useMemo(
    () =>
      groupActivities(
        activities.filter((a) => (type === "done" ? a.done : !a.done))
      ),
    [activities, groupActivities, type]
  )

  // TODO @Peto: break out this component here from this component - it shouldn't be defined nested like this
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
                      onClick={() =>
                        bulkRepeatToday(
                          activities[i].activities.map(({ id }) => id)
                        )
                      }
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
                      checkActivity={check}
                      deleteActivity={deleteActivity}
                      editActivity={edit}
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
      {type === "todo" && <TitleInput onSave={(title) => add({ title })} />}

      <ActivitiesList activities={activitiesToDisplay}></ActivitiesList>
    </div>
  )
}

const GridStyled = styled(Grid)`
  @media (min-width: 600px) {
    padding: 20px;
  }
`
