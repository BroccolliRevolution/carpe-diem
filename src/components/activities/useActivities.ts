import { useState } from "react"

type Activities = {
  title: string
  done: boolean
}

const UseActivities = () => {
  const [activities, setActivities] = useState<Activities[]>([])

  return { activities, setActivities }
}

export default UseActivities
