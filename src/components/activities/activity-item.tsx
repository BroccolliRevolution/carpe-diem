import styled from "@emotion/styled"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import SaveIcon from "@mui/icons-material/Save"
import { Checkbox, IconButton, TextField, Tooltip } from "@mui/material"
import dayjs from "dayjs"
import { useRef, useState } from "react"
import { Activity } from "./useActivities"

type Props = {
  activity: Activity
  deleteActivity: (activity: Activity) => void
  editActivity: (data: { activity: Activity; activityData: Activity }) => void
  checkActivity: (activity: Activity) => void
}

const ActivityItem = ({
  activity,
  deleteActivity,
  editActivity,
  checkActivity,
}: Props) => {
  const [title, setTitle] = useState<string>(activity.title)
  const [editing, setEditing] = useState(false)
  const titleText = useRef(null)

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

        {editing && (
          <IconButton
            size="small"
            aria-label="edit activity"
            component="label"
            onClick={() => {
              editActivity({ activity, activityData: { ...activity, title } })
              setEditing(!editing)
            }}
          >
            <SaveIcon />
          </IconButton>
        )}
      </div>

      {!editing ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flex: "1 1 70%",
            justifyContent: "flex-end",
          }}
        >
          <Tooltip
            placement="top"
            arrow={true}
            title={dayjs(activity.created_at).format("HH:mm:ss")}
          >
            <span>{activity.title}</span>
          </Tooltip>
        </div>
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

              editActivity({ activity, activityData: { ...activity, title } })
              setEditing(!editing)
            }
          }}
        />
      )}
      {/* {activity.done === false && (
        <button onClick={() => checkActivity(activity)}>Done</button>
      )}
       */}
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
  min-width: 350px;
  max-width: 450px;

  flex-wrap: wrap;
  margin: 2px;
`

export default ActivityItem
