import { Interval, intervals } from "@/core/daily"
import { Daily } from "@/utils/api-types"
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

type AddProps = {
  type: "add"
  daily?: undefined
  openDialog: boolean
  handleClose: () => void
}

type EditProps = {
  type: "edit"
  daily: Daily
  openDialog: boolean
  handleClose: () => void
}

type Props = AddProps | EditProps

export default function SaveDaily({
  type,
  daily,
  openDialog,
  handleClose,
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

  const utils = trpc.useContext()
  const add = trpc.daily.add.useMutation({
    onSuccess({ all }) {
      utils.daily.all.setData(undefined, all)
    },
  }).mutate

  const edit = trpc.daily.edit.useMutation({
    onSuccess(all) {
      utils.daily.all.setData(undefined, all)
    },
  }).mutate

  const deleteDaily = trpc.daily.delete.useMutation({
    onSuccess(all) {
      utils.daily.all.setData(undefined, all)
    },
  }).mutate

  const dailies = trpc.daily.all.useQuery().data ?? []

  const save = async (e: FormEvent) => {
    e.preventDefault()
    if (!title) {
      setError(true)
      return
    }

    if (type === "add") {
      await add({ title, parentId, periodicity })
    } else {
      await edit({ id: daily.id, data: { title, parentId, periodicity } })
    }
    setTitle("")
    setParent(null)
    setError(false)
    setPeriodicity(DEFAULT_PERIODICITY)
    handleClose()
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Permanent Task</DialogTitle>
        <DialogContent>
          <Box component="form" maxWidth={380} noValidate onSubmit={save}>
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
                if (confirmed) {
                  deleteDaily(daily.id)
                  handleClose()
                }
              }}
            >
              Delete
            </Button>
          )}
          <Button
            onClick={() => {
              setError(false)
              handleClose()
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
