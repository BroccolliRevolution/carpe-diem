import DailyItem from "./daily-item"
import NewDaily from "./new-daily"
import useDailies from "./useDailies"

export const Dailies = () => {
  const { dailies, add, check } = useDailies()

  return (
    <div>
      <h3>Dailies</h3>

      <NewDaily />

      <ul style={{ listStyleType: "none", padding: 0 }}>
        {dailies.map((daily) => (
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
