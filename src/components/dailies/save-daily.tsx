import { Interval, intervals } from "@/core/daily"
import { Daily, DailyAddData, DailyEditData } from "@/utils/api-types"
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

type Props = {
  daily?: Daily
  openDialog: boolean
  save: (daily: DailyEditData | DailyAddData) => void
  deleteDaily?: () => void
  handleClose: () => void
}

export default function SaveDaily({
  daily,
  openDialog,
  save,
  handleClose,
  deleteDaily,
}: Props) {
  const [open, setOpen] = useState(openDialog)
  const [parentId, setParent] = useState<number | null>(daily?.parentId ?? null)
  const [periodicity, setPeriodicity] = useState<Interval>(
    daily?.periodicity ?? DEFAULT_PERIODICITY
  )

  const [title, setTitle] = useState(daily?.title ?? "")
  const [error, setError] = useState(false)

  if (open !== openDialog) {
    setOpen(openDialog)
  }

  const dailies = trpc.daily.all.useQuery().data ?? []

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()

    if (!title) {
      setError(true)
      return
    }

    setError(false)
    if (daily) {
      save({
        id: daily.id ?? 0,
        data: {
          title,
          periodicity,
          parentId,
        },
      })
    } else {
      save({
        title,
        periodicity,
        parentId,
      })
    }
    handleClose()
  }

  const close = () => {
    handleClose()
  }

  return (
    <>
      <Dialog open={open} onClose={close}>
        <DialogTitle>{daily ? "Edit " : "New"} Permanent Task</DialogTitle>

        <DialogContent>
          <Box component="form" maxWidth={380} noValidate onSubmit={handleSave}>
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
            {error && (
              <span style={{ color: "red" }}>Title cannot be empty</span>
            )}

            <FormControl fullWidth margin="normal">
              <InputLabel id="parent-label">Parent</InputLabel>
              <Select
                labelId="parent-label"
                id="parent"
                value={parentId ?? ""}
                label="Parent"
                onChange={(e) => {
                  const value = e.target.value
                  setParent(value === "" ? null : Number(value))
                }}
              >
                <MenuItem value="">--- Select a daily ---</MenuItem>
                {dailies
                  .filter(({ id }) => id !== daily?.id)
                  .map((daily) => (
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
        <DialogActions
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          {daily && (
            <Button
              color="error"
              onClick={() => {
                const confirmed = window.confirm(
                  "Are you sure you want to delete this daily?"
                )

                // TODO @Peto: make the use of discriminating union or something else in this components props
                if (confirmed) {
                  deleteDaily?.()
                  handleClose()
                }
              }}
            >
              Delete
            </Button>
          )}
          <Button onClick={close}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
