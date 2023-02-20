import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import { Button, Grid, IconButton, TextField } from "@mui/material"
import { useRef, useState } from "react"
import styled from "styled-components"
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
    const activity = { title, done: false }
    addActivity(activity)
    setTitle("")
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
        <Grid item xs={12} alignItems="stretch" style={{ display: "flex" }}>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {activities.map((activity: Activity) => (
              // <ListItem key={activity.id}>
              //   <span>{activity.title}</span>

              //   <div>{activity.title}</div>

              //   <div>
              //     <IconButton
              //       size="small"
              //       color="error"
              //       aria-label="delete activity"
              //       component="label"
              //       onClick={() => deleteActivity(activity)}
              //     >
              //       <DeleteIcon />
              //     </IconButton>
              //     <IconButton
              //       size="small"
              //       aria-label="edit activity"
              //       component="label"
              //       onClick={() => console.log(activity)}
              //     >
              //       <EditIcon />
              //     </IconButton>
              //   </div>
              // </ListItem>
              <ActivityItem
                key={activity.id}
                activity={activity}
                checkActivity={(d) => checkActivity}
                deleteActivity={deleteActivity}
                editActivity={editActivity}
              ></ActivityItem>
            ))}
          </ul>
        </Grid>
      </Grid>
      <Grid item xs={12} md={5} lg={5}>
        <h3>Daily Log</h3>
      </Grid>
    </Grid>
  )
}

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  min-width: 350px;
`

export default EditActivities
