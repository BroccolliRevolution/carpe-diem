import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
} from "@mui/material"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import TextField from "@mui/material/TextField"
import { FormEvent, useState } from "react"
import useDailies, { intervals } from "./useDailies"

type Props = {
  onSave: (goal: any) => void
}
export default function NewActivity() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [parent, setParent] = useState<number | null>(null)
  const { dailies, add } = useDailies()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const save = async (e: FormEvent) => {
    e.preventDefault()
    await add({ title })
    setTitle("")
    handleClose()
  }

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <Box component="form" onSubmit={save}>
          <DialogTitle>New Permanent Task</DialogTitle>
          <DialogContent>
            {/* <DialogContentText></DialogContentText> */}

            <Box component="form" noValidate>
              <TextField
                margin="normal"
                fullWidth
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                id="outlined-basic"
                label="Title"
                variant="standard"
              />

              <FormControl fullWidth margin="normal">
                <InputLabel id="parent-label">Parent</InputLabel>
                <Select
                  labelId="parent-label"
                  id="parent"
                  value={parent}
                  label="Parent"
                  onChange={(e) => setParent(Number(e.target.value))}
                >
                  {dailies.map((daily) => (
                    <MenuItem key={`daily_${daily.id}`} value={daily.id}>
                      {daily.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="interval-label">Periodicity</InputLabel>
                <Select
                  labelId="interval-label"
                  id="interval"
                  value={parent}
                  label="Interval"
                  onChange={(e) => setParent(Number(e.target.value))}
                >
                  {intervals.map((interval, index) => (
                    <MenuItem key={`interval_${interval}`} value={index}>
                      {interval}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Save
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  )
}
