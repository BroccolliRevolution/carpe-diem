import DeleteIcon from "@mui/icons-material/Delete"
import SaveIcon from "@mui/icons-material/Save"
import EditIcon from "@mui/icons-material/Edit"
import { IconButton, TextField } from "@mui/material"
import { useRef, useState } from "react"
import styled from "styled-components"
import UseActivities, { Activity } from "./useActivities"

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
    <ListItem key={activity.id}>
      {!editing ? (
        <span>{activity.title}</span>
      ) : (
        <TextField
          ref={titleText}
          fullWidth
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
          focused={true}
          onKeyDown={(ev) => {
            if (ev.key === "Enter") {
              ev.preventDefault()

              editActivity({ activity, activityData: { ...activity, title } })
              setEditing(!editing)
            }
          }}
        />
      )}

      <div style={{ display: "flex" }}>
        <IconButton
          size="small"
          aria-label="edit activity"
          component="label"
          onClick={() => {
            setEditing(!editing)
            // TODO @Peto: finish focus here
            titleText.current && titleText.current?.focus()
          }}
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

        <IconButton
          size="small"
          color="error"
          aria-label="delete activity"
          component="label"
          onClick={() => deleteActivity(activity)}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    </ListItem>
  )
}

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  min-width: 350px;
`

export default ActivityItem
