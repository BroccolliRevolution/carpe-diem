import { Interval, intervals } from "@/core/daily"
import { trpc } from "@/utils/trpc"
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import TextField from "@mui/material/TextField"
import { FormEvent, useState } from "react"

const DEFAULT_PERIODICITY = intervals[0]
export default function NewDaily() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [parentId, setParent] = useState<number | null>(0)
  const [periodicity, setPeriodicity] = useState<Interval>(DEFAULT_PERIODICITY)

  const utils = trpc.useContext()
  const add = trpc.daily.add.useMutation({
    onSuccess({ all }) {
      utils.daily.all.setData(undefined, all)
    },
  }).mutate

  const dailies = trpc.daily.all.useQuery().data ?? []

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const save = async (e: FormEvent) => {
    e.preventDefault()
    await add({ title, parentId, periodicity })
    setTitle("")
    setParent(null)
    setPeriodicity(DEFAULT_PERIODICITY)
    handleClose()
  }

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add daily
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Permanent Task</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate onSubmit={save}>
            <TextField
              margin="normal"
              fullWidth
              autoFocus
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
                value={parentId}
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
                value={intervals.indexOf(periodicity as Interval)}
                label="Interval"
                onChange={(e) =>
                  setPeriodicity(intervals[Number(e.target.value)])
                }
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
      </Dialog>
    </>
  )
}
