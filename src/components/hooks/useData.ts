import { clear } from "console"
import { useMutation, useQuery, useQueryClient } from "react-query"

export type Activity = {
  id: number
  title: string
  created_at: string
  done_at?: string
  done: boolean
  priority: number
}

export type ActivityAddData = {
  title: string
  priority?: number
}

export type ActivityEditData = {
  id: number
  title?: string
  priority?: number
  done?: boolean
}

export type EditType = {
  activity: Activity
  activityData: ActivityEditData
}

const useActivities = () => {
  const queryClient = useQueryClient()

  const fetchActivities = async () => {
    const res = (await (
      await fetch("/api/activity/all")
    ).json()) as unknown as Activity[]

    // TODO @Peto: validate for type? from API call?
    return res
  }

  const addActivityMutation = async (activity: ActivityAddData) => {
    return (
      await fetch("/api/activity/add", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(activity),
      })
    ).json()
  }

  const editActivityMutation = async ({ activity, activityData }: EditType) => {
    return (
      await fetch(`/api/activity/edit/${activity.id}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(activityData),
      })
    ).json()
  }

  const editPriorityMutation = async ({
    id,
    priority,
  }: {
    id: number
    priority: number
  }) => {
    return (
      await fetch(`/api/activity/edit-priority/${id}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(priority),
      })
    ).json()
  }

  const editPriorityTopMutation = async (activity: Activity) => {
    return await (
      await fetch(`/api/activity/edit-priority-top/${activity.id}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
    ).json()
  }

  const checkActivityMutation = async (activity: Activity) => {
    return await (
      await fetch(`/api/activity/check/${activity.id}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
    ).json()
  }

  const repeatActivityMutation = async (activity: Activity) => {
    return (
      await fetch(`/api/activity/repeat/${activity.id}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
    ).json()
  }

  const bulkRepeatTodayMutation = async (activities: Activity[]) => {
    return (
      await fetch(`/api/activity/bulk-repeat`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(activities.map((a) => a.id)),
      })
    ).json()
  }

  const deleteActivityMutation = async (activity: Activity) => {
    return (
      await fetch(`/api/activity/delete/${activity.id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
    ).json()
  }

  const activities =
    useQuery({
      queryKey: ["activities"],
      queryFn: fetchActivities,
      // refetchInterval: 2000,
    }).data ?? []

  const addActivity = useMutation({
    mutationFn: addActivityMutation,
    onSuccess: (data) => queryClient.setQueryData(["activities"], data),
  }).mutate

  const editActivity = useMutation({
    mutationFn: editActivityMutation,
    onSuccess: (data) => {
      queryClient.setQueryData(["activities"], data)
    },
  }).mutate

  const editPriority = useMutation({
    mutationFn: editPriorityMutation,
    onSuccess: (data) => {
      queryClient.setQueryData(["activities"], data)
    },
  }).mutate

  const editPriorityTop = useMutation({
    mutationFn: editPriorityTopMutation,
    onSuccess: (data) => {
      queryClient.setQueryData(["activities"], data)
    },
  }).mutate

  const deleteActivity = useMutation({
    mutationFn: deleteActivityMutation,
    onSuccess: (data) => {
      queryClient.setQueryData(["activities"], data)
    },
  }).mutate

  const checkActivity = useMutation({
    mutationFn: checkActivityMutation,
    onSuccess: (data) => {
      queryClient.setQueryData(["activities"], data)
    },
  }).mutate

  const repeatActivityToday = useMutation({
    mutationFn: repeatActivityMutation,
    // onSettled: () => {
    //   queryClient.invalidateQueries({
    //     queryKey: ["activities"],
    //   })
    // },
    onSuccess: (data) => {
      queryClient.setQueryData(["activities"], data)
    },
  }).mutate

  const bulkRepeatToday = useMutation({
    mutationFn: bulkRepeatTodayMutation,
    onSuccess: (data) => {
      queryClient.setQueryData(["activities"], data)
    },
  }).mutate

  return {
    activities,
    addActivity,
    deleteActivity,
    editActivity,
    editPriority,
    editPriorityTop,
    checkActivity,
    repeatActivityToday,
    bulkRepeatToday,
  }
}

export default useActivities
