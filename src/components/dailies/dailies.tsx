import { Daily, DailyAddData, DailyEditData } from "@/utils/api-types"
import { trpc } from "@/utils/trpc"
import { Button } from "@mui/material"
import { useState } from "react"
import DailyItem from "./daily-item"
import SaveDaily from "./save-daily"

const useDaily = () => {
  const utils = trpc.useContext()
  const q = trpc.daily.all.useQuery()
  const check = trpc.daily.check.useMutation({
    onSuccess({ dailies, activities }) {
      utils.daily.all.setData(undefined, dailies)
      utils.activity.all.setData(undefined, activities)
    },
  }).mutate

  const seed = trpc.daily.seedTest.useMutation({
    onSuccess() {
      utils.daily.all.invalidate()
    },
  }).mutate

  const deleteDaily = trpc.daily.delete.useMutation({
    onSuccess(all) {
      utils.daily.all.setData(undefined, all)
    },
  }).mutate

  const add = trpc.daily.add.useMutation({
    onSuccess({ all, daily }) {
      utils.daily.all.setData(undefined, all)
    },
    onError(err) {
      alert(err.message)
    },
  }).mutate

  const edit = trpc.daily.edit.useMutation({
    onSuccess(all) {
      utils.daily.all.setData(undefined, all)
    },
  }).mutate

  const dailies = q.data
  const loading = q.isLoading

  return {
    check,
    seed,
    deleteDaily,
    add,
    edit,
    dailies,
    loading,
  }
}

export const Dailies = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const [editedDaily, setEditedDaily] = useState<Daily | undefined | null>()
  const [added, setAdded] = useState(false)

  const { dailies, loading, check, seed, deleteDaily, edit, add } = useDaily()

  if (loading) return <>Loading...</>
  return (
    <div>
      <h3>Dailies</h3>

      <Button
        variant="outlined"
        onClick={() => {
          setEditedDaily(undefined)
          setAdded(false)
          setOpenDialog(!openDialog)
        }}
      >
        Add daily
      </Button>
      <SaveDaily
        key={editedDaily?.id ?? (added ? "added" : "prepared")}
        daily={editedDaily}
        openDialog={openDialog || Boolean(editedDaily)}
        handleClose={() => {
          setOpenDialog(false)
          setEditedDaily(undefined)
        }}
        deleteDaily={() => deleteDaily(editedDaily?.id as number)}
        save={async (daily) => {
          if (editedDaily) {
            edit(daily as DailyEditData)
          } else {
            add(daily as DailyAddData)
            setAdded(true)
          }
        }}
      />

      <Button onClick={() => seed()}>Seed</Button>

      <ul style={{ listStyleType: "none", padding: 0 }}>
        {dailies &&
          dailies.map((daily) => (
            <DailyItem
              key={daily.id + daily.title}
              daily={daily}
              check={check}
              editPriorityTop={() => console.log()}
              editPriority={() => console.log()}
              editing={() => setEditedDaily(daily)}
            />
          ))}
      </ul>
    </div>
  )
}
