import { Button, Grid, TextField } from "@mui/material"
import { useState } from "react"
import { ButtonLink } from "../common/ButtonLink"

type Props = {
  onSave: (data: string) => void
}

export const TitleInput = ({ onSave }: Props) => {
  const [title, setTitle] = useState("")
  const [multiline, setMultiline] = useState(false)
  const [showError, setShowError] = useState(false)

  const save = () => {
    if (title === "") {
      setShowError(true)
      return
    }
    onSave(title)
    setTitle("")
    setShowError(false)
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
              variant="standard"
              onKeyDown={(ev) => {
                if (ev.key === "Enter") {
                  ev.preventDefault()
                  save()
                }
              }}
            />
          </Grid>

          <Grid item xs={2} alignItems="stretch" style={{ display: "flex" }}>
            <Button onClick={save} variant="contained">
              +
            </Button>
          </Grid>
        </Grid>
        {showError && <div style={{ color: "red" }}>Title cannot be empty</div>}
      </div>
    </>
  )
}
