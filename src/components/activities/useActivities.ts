import { useMutation, useQuery, useQueryClient } from "react-query"
import { fetchFn } from "../common/api"

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

  const addActivityMutation = async (activity: ActivityAddData) =>
    fetchFn(`/api/activity/add`, "POST", JSON.stringify(activity))

  const editActivityMutation = async ({ activity, activityData }: EditType) =>
    fetchFn(
      `/api/activity/edit/${activity.id}`,
      "PATCH",
      JSON.stringify(activityData)
    )

  const editPriorityMutation = async ({
    id,
    priority,
  }: {
    id: number
    priority: number
  }) =>
    fetchFn(
      `/api/activity/edit-priority/${id}`,
      "POST",
      JSON.stringify(priority)
    )

  const editPriorityTopMutation = async (activity: Activity) =>
    fetchFn(`/api/activity/edit-priority-top/${activity.id}`, "POST")

  const checkActivityMutation = async (activity: Activity) =>
    fetchFn(`/api/activity/check/${activity.id}`, "POST")

  const repeatActivityMutation = async (activity: Activity) =>
    fetchFn(`/api/activity/repeat/${activity.id}`, "POST")

  const bulkRepeatTodayMutation = async (activities: Activity[]) =>
    fetchFn(
      `/api/activity/bulk-repeat`,
      "POST",
      JSON.stringify(activities.map((a) => a.id))
    )

  const deleteActivityMutation = async (activity: Activity) =>
    fetchFn(`/api/activity/delete/${activity.id}`, "DELETE")

  const fetchActivities = async () => {
    const res = (await (
      await fetch("/api/activity/all")
    ).json()) as unknown as Activity[]

    // TODO @Peto: validate for type? from API call?
    return res
  }
  const activities =
    useQuery({
      queryKey: ["activities"],
      queryFn: fetchActivities,
      // refetchInterval: 2000,
    }).data ?? []

  const mutationData = <T, D>(
    fn: (...args: T[]) => Promise<D>
  ): {
    mutationFn: (...args: T[]) => Promise<D>
    onSuccess: (data: D) => void
  } => ({
    mutationFn: fn,
    onSuccess: (data: any) => queryClient.setQueryData(["activities"], data),
  })

  return {
    activities,
    addActivity: useMutation(mutationData(addActivityMutation)).mutate,
    deleteActivity: useMutation(mutationData(deleteActivityMutation)).mutate,
    editActivity: useMutation(mutationData(editActivityMutation)).mutate,
    editPriority: useMutation(mutationData(editPriorityMutation)).mutate,
    editPriorityTop: useMutation(mutationData(editPriorityTopMutation)).mutate,
    checkActivity: useMutation(mutationData(checkActivityMutation)).mutate,
    repeatActivityToday: useMutation(mutationData(repeatActivityMutation))
      .mutate,
    bulkRepeatToday: useMutation(mutationData(bulkRepeatTodayMutation)).mutate,
  }
}

export default useActivities
