import { useMutation, useQuery, useQueryClient } from "react-query"

export type Activity = {
  id?: number
  title: string
  created_at?: string
  done: boolean
  priority: number
}

const UseActivities = () => {
  const queryClient = useQueryClient()

  const fetchActivities = async () => {
    const res = (await (
      await fetch("/api/activity/all")
    ).json()) as unknown as Activity[]

    // TODO @Peto: validate for type? from API call?
    return res
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
    onMutate: async (activity) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ["activities", activity.id],
      })

      // Snapshot the previous value
      const previous = queryClient.getQueryData(["activities"]) as Activity[]
      activity.done = !activity.done

      const newData = previous.map((p) => (p.id === activity.id ? activity : p))

      // Optimistically update to the new value
      queryClient.setQueryData(["activities"], newData)
      return { newData, activity }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["activities_not_done"],
      })
      queryClient.invalidateQueries({
        queryKey: ["activities_done"],
      })
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
