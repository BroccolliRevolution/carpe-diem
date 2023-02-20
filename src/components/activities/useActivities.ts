import { useMutation, useQuery, useQueryClient } from "react-query"

export type Activity = {
  title: string
  done: boolean
}

const UseActivities = () => {
  const queryClient = useQueryClient()

  const fetchActivities = async () => {
    const res = await fetch("/api/activities")
    return res.json()
  }

  const addActivityMutation = async (activity: Activity) => {
    await fetch("/api/add-activity", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(activity),
    })
  }
  const activities =
    useQuery({ queryKey: ["activities"], queryFn: fetchActivities }).data ?? []

  const addActivity = useMutation({
    mutationFn: addActivityMutation,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["activities"] })
    },
  }).mutate

  return { activities, addActivity }
}

export default UseActivities
