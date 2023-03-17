import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchFn, useApi } from "../common/useApi"

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
  const { mutationData, queryClient, data } = useApi<Activity>(
    "activities",
    "/api/activity/all"
  )

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

  return {
    activities: data,
    addActivity: useMutation(mutationData(addActivityMutation)).mutate,
    deleteActivity: useMutation(mutationData(deleteActivityMutation)).mutate,
    editPriority: useMutation(mutationData(editPriorityMutation)).mutate,
    editActivity: useMutation(mutationData(editActivityMutation)).mutate,
    editPriorityTop: useMutation(mutationData(editPriorityTopMutation)).mutate,
    checkActivity: useMutation(
      mutationData(checkActivityMutation, (_) =>
        queryClient.invalidateQueries(["dailies"])
      )
    ).mutate,
    repeatActivityToday: useMutation(mutationData(repeatActivityMutation))
      .mutate,
    bulkRepeatToday: useMutation(mutationData(bulkRepeatTodayMutation)).mutate,
  }
}

export default useActivities
