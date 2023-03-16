import { RouterOutputs, trpc } from "@/utils/trpc"
import { Button } from "@mui/material"
import DailyItem from "./daily-item"
import NewDaily from "./new-daily"

export const Dailies = () => {
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

      <NewDaily />

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
