import { Button, Grid, TextField } from "@mui/material"
import Link from "next/link"
import { useState } from "react"
import { ButtonLink } from "./ButtonLink"

type ActivityData = {
  title: string
}
type Props = {
  addActivity: (data: ActivityData) => void
}

export const TitleInput = ({ addActivity }: Props) => {
  const [title, setTitle] = useState("")
  const [multiline, setMultiline] = useState(false)
  const [showError, setShowError] = useState(false)

  const saveActivity = () => {
    if (title === "") {
      setShowError(true)
      return
    }
    const activity = { title }
    setTitle("")
    setShowError(false)
    addActivity(activity)
  }

  return (
    <>
      <div>
        <ButtonLink onClick={(e) => setMultiline(!multiline)}>
          {multiline ? "Simple" : "Multiline"}
        </ButtonLink>

        <Grid container>
          <Grid item xs={10} lg={10} style={{ maxWidth: 390 }}>
            <TextField
              multiline={multiline}
              rows={7}
              fullWidth
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              id="outlined-basic"
              label="Title"
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
        {showError && <div style={{ color: "red" }}>Title cannot be empty</div>}
      </div>
    </>
  )
}
