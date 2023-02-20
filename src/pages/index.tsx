import { Button, Grid, Paper, TextField } from "@mui/material"
import { useRef, useState } from "react"

type Activities = {
  title: string
  done: boolean
}
function Home() {
  const [activities, setActivities] = useState<Activities[]>([])
  const [title, setTitle] = useState<string>("")
  const titleText = useRef(null)

  const saveActivity = () => {
    const activity = { title, done: false }
    setActivities([...activities, activity])
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
                console.log(`Pressed keyCode ${ev.key}`)
                if (ev.key === "Enter") {
                  // Do code here
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
          {title}
          {JSON.stringify(activities)}
          <ul>
            {activities.map((activity) => (
              <li key={activity.title}>{activity.title}</li>
            ))}
            <li></li>
          </ul>
        </Grid>
      </Grid>
      <Grid item xs={12} md={5} lg={5}>
        <h3>Daily Log</h3>
      </Grid>
    </Grid>
  )
}
export default Home
