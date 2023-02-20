import { Button, Grid, TextField } from "@mui/material"
import { useRef, useState } from "react"
import UseActivities, { Activity } from "./useActivities"

const EditActivities = () => {
  const { activities, addActivity } = UseActivities()
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
              <li key={activity.title}>{activity.title}</li>
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
export default EditActivities
