import { Activity, ActivityEditData } from "@/utils/api-types"
import styled from "@emotion/styled"
import AirlineStopsIcon from "@mui/icons-material/AirlineStops"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import SaveIcon from "@mui/icons-material/Save"

import {
  Badge,
  Card,
  Checkbox,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material"
import { useRef, useState } from "react"
import { ChoppedTitle } from "../common/ChoppedTitle"
import { formatDate, formatTime, today } from "../common/dateTime"

type PropType<TObj, TProp extends keyof TObj> = TObj[TProp]

type Props = {
  activity: Activity
  checkable: boolean
  deleteActivity: (id: number) => void
  editActivity: (data: ActivityEditData) => void
  editPriority: ({
    id,
    priority,
  }: {
    id: PropType<Activity, "id">
    priority: PropType<Activity, "priority">
  }) => void
  checkActivity: (id: number) => void
  editPriorityTop: (id: number) => void
  repeatActivityToday: (id: number) => void
}
const ActivityItem = ({
  activity,
  checkable,
  deleteActivity,
  editActivity,
  checkActivity,
  repeatActivityToday,
  editPriority,
  editPriorityTop,
}: Props) => {
  const [title, setTitle] = useState<string>(activity.title)
  const [editing, setEditing] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const titleText = useRef(null)

  const isTodaysActivity = formatDate(activity.created_at) === today()

  // TODO @Peto: change ListItem to div or something else, ListItem should be together with the usage of List
  return (
    <ListItem
      key={activity.id + activity.title}
      style={{
        border: " 1px solid #00000047",
        borderRadius: 5,
        display: "flex",
      }}
    >
      <div style={{ display: "flex", position: "relative" }}>
        {showOptions && (
          <CloseOptions
            badgeContent="x"
            color="warning"
            onClick={() => setShowOptions(false)}
            style={{
              zIndex: 101,
            }}
          />
        )}
        <IconButton
          size="small"
          aria-label="priority down"
          component="label"
          onClick={() => setShowOptions(!showOptions)}
        >
          <MoreHorizIcon />
        </IconButton>

        {isTodaysActivity && !activity.done && (
          <>
            <IconButton
              size="small"
              aria-label="priority up"
              component="label"
              onClick={() =>
                editPriority({
                  id: activity.id,
                  priority: activity.priority + 1,
                })
              }
            >
              <ArrowUpwardIcon />
            </IconButton>
            <IconButton
              size="small"
              aria-label="priority down"
              component="label"
              onClick={() =>
                editPriority({
                  id: activity.id,
                  priority: activity.priority - 1,
                })
              }
            >
              <ArrowDownwardIcon />
            </IconButton>
          </>
        )}

        <div
          style={{
            display: showOptions ? "flex" : "none",
            position: "absolute",
            zIndex: 100,
          }}
        >
          <Card variant="outlined">
            <IconButton
              size="small"
              color="error"
              aria-label="delete activity"
              component="label"
              onClick={() => deleteActivity(activity.id)}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              size="small"
              aria-label="edit activity"
              component="label"
              onClick={() => {
                setShowOptions(false)
                setEditing(!editing)
              }}
            >
              <EditIcon />
            </IconButton>

            {isTodaysActivity && !activity.done && (
              <IconButton
                size="small"
                aria-label="top priority"
                component="label"
                onClick={() => editPriorityTop(activity.id)}
              >
                <AirlineStopsIcon />
              </IconButton>
            )}
          </Card>
        </div>

        {!isTodaysActivity && (
          <Tooltip placement="top" arrow={true} title="repeat again today">
            <IconButton
              size="small"
              aria-label="repeat again today"
              component="label"
              onClick={() => {
                repeatActivityToday(activity.id)
              }}
            >
              <RestartAltIcon />
            </IconButton>
          </Tooltip>
        )}

        {editing && (
          <IconButton
            size="small"
            aria-label="edit activity"
            component="label"
            onClick={() => {
              editActivity({
                id: activity.id,
                data: {
                  title,
                },
              })
              setEditing(!editing)
            }}
          >
            <SaveIcon />
          </IconButton>
        )}
      </div>

      {!editing ? (
        <ActivityTitle>
          <Tooltip
            placement="top"
            arrow={true}
            title={formatTime(activity?.done_at ?? activity.created_at)}
          >
            <span style={{ padding: 5 }}>
              <ChoppedTitle title={activity.title} />
            </span>
          </Tooltip>
        </ActivityTitle>
      ) : (
        <TextField
          ref={titleText}
          fullWidth
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
          autoFocus
          onKeyDown={(ev) => {
            if (ev.key === "Enter") {
              ev.preventDefault()

              editActivity({
                id: activity.id,
                data: { title },
              })
              setEditing(!editing)
            }
          }}
        />
      )}

      <div style={{ minWidth: 30 }}>
        {checkable && (
          <Checkbox
            checked={activity.done}
            onChange={() => checkActivity(activity.id)}
          />
        )}
      </div>
    </ListItem>
  )
}

const CloseOptions = styled(Badge)`
  :hover {
    cursor: pointer;
  }
`
const ListItem = styled.li`
  display: flex;
  justify-content: space-between;

  flex-wrap: wrap;
  margin: 2px;

  @media (min-width: 600px) {
    min-width: 350px;
    max-width: 450px;
  }
`
const ActivityTitle = styled.div`
  display: flex;
  align-items: center;
  flex: 1 1 65%;
  justify-content: flex-start;
  border-left: 1px solid rgb(0 0 0 / 24%);

  @media (max-width: 500px) {
    flex: 1 1 50%;
  }
`

export default ActivityItem
