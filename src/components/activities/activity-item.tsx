import styled from "@emotion/styled"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import SaveIcon from "@mui/icons-material/Save"
import { Checkbox, IconButton, TextField, Tooltip } from "@mui/material"
import { useRef, useState } from "react"
import { formatDate, formatTime, today } from "../common/dateTime"
import { Activity, EditType } from "./useActivities"

type Props = {
  activity: Activity
  deleteActivity: (activity: Activity) => void
  editActivity: (data: EditType) => void
  checkActivity: (activity: Activity) => void
  repeatActivityToday: (activity: Activity) => void
}

const ActivityItem = ({
  activity,
  deleteActivity,
  editActivity,
  checkActivity,
  repeatActivityToday,
}: Props) => {
  const [title, setTitle] = useState<string>(activity.title)
  const [editing, setEditing] = useState(false)
  const titleText = useRef(null)

  const isTodaysActivity = formatDate(activity.created_at) === today()

  return (
    <ListItem
      key={activity.id}
      style={{
        border: " 1px solid #00000047",
        borderRadius: 5,
        display: "flex",
      }}
    >
      <div style={{ display: "flex" }}>
        <IconButton
          size="small"
          color="error"
          aria-label="delete activity"
          component="label"
          onClick={() => deleteActivity(activity)}
        >
          <DeleteIcon />
        </IconButton>

        <IconButton
          size="small"
          aria-label="edit activity"
          component="label"
          onClick={() => setEditing(!editing)}
        >
          <EditIcon />
        </IconButton>

        {!isTodaysActivity && (
          <Tooltip placement="top" arrow={true} title="repeat again today">
            <IconButton
              size="small"
              aria-label="repeat again today"
              component="label"
              onClick={() => {
                repeatActivityToday(activity)
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
                activity,
                activityData: { id: activity.id, title },
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
            <span>{activity.title}</span>
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
                activity,
                activityData: { id: activity.id, title },
              })
              setEditing(!editing)
            }
          }}
        />
      )}

      <Checkbox
        checked={activity.done}
        onChange={() => checkActivity(activity)}
      />
    </ListItem>
  )
}

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
  justify-content: flex-end;

  @media (max-width: 500px) {
    flex: 1 1 50%;
  }
`

export default ActivityItem
