import { useMutation, useQuery, useQueryClient } from "react-query"

export type Activity = {
  id?: number
  title: string
  done: boolean
}

const UseActivities = () => {
  const queryClient = useQueryClient()

  const fetchActivities = async () => {
    const res = await fetch("/api/activity/all")
    return res.json()
  }

  const addActivityMutation = async (activity: Activity) => {
    await fetch("/api/activity/add", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(activity),
    })
  }

  type EditType = {
    activity: Activity
    activityData: Activity
  }
  const editActivityMutation = async ({ activity, activityData }: EditType) => {
    await fetch(`/api/activity/edit/${activity.id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(activityData),
    })
  }
  const checkActivityMutation = async (activity: Activity) => {
    await fetch(`/api/activity/check/${activity.id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
  }

  const deleteActivityMutation = async (activity: Activity) => {
    await fetch(`/api/activity/delete/${activity.id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
  }

  const activities =
    useQuery({
      queryKey: ["activities"],
      queryFn: fetchActivities,
      // refetchInterval: 2000,
    }).data ?? []

  const addActivity = useMutation({
    mutationFn: addActivityMutation,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["activities"] })
    },
  }).mutate

  const editActivity = useMutation({
    mutationFn: editActivityMutation,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["activities"] })
    },
  }).mutate

  const deleteActivity = useMutation({
    mutationFn: deleteActivityMutation,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["activities"] })
    },
  }).mutate

  const checkActivity = useMutation({
    mutationFn: checkActivityMutation,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["activities"] })
    },
  }).mutate

  return {
    activities,
    addActivity,
    deleteActivity,
    editActivity,
    checkActivity,
  }
}

export default UseActivities
