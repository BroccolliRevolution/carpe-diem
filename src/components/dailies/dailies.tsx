import { trpc } from "@/utils/trpc"
import { Button } from "@mui/material"
import { useState } from "react"
import DailyItem from "./daily-item"
import SaveDaily from "./save-daily"

export const Dailies = () => {
  const [openDialog, setOpenDialog] = useState(false)

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

  const dailies = q.data
  const loading = q.isLoading

  if (loading) return <>Loading...</>
  return (
    <div>
      <h3>Dailies</h3>

      <Button variant="outlined" onClick={() => setOpenDialog(!openDialog)}>
        Add daily
      </Button>
      <SaveDaily
        type="add"
        openDialog={openDialog}
        handleClose={() => setOpenDialog(false)}
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
            />
          ))}
      </ul>
    </div>
  )
}
