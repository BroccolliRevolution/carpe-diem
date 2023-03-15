import { useMutation } from "@tanstack/react-query"
import { Activity } from "../activities/useActivities"
import { fetchFn, useApi } from "../common/useApi"

// TODO @Peto: this should go to backend -  trpc
// TODO @Peto: even better - get lists like these from tRPC call, go to db to fetch these values
export const intervals = [
  "DAY",
  "WEEK",
  "MONTH",
  "QUARTER",
  "YEAR",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const

export type Interval = typeof intervals[number]

export type Daily = {
  id: number
  title: string
  created_at: string
  active: boolean
  note: string | null
  priority: number
  importance: number
  periodicity: Interval
  parentId: number | null
  labelId: number | null
}

export type DailyAddData = {
  title: string
  parentId?: number | null
  periodicity?: Interval | null
}

export type DailyEditData = {
  id: number
  title?: string
  priority?: number
  done?: boolean
}

export type EditType = {
  daily: Daily
  data: DailyEditData
}

const useDailies = () => {
  const { mutationData, queryClient, data } = useApi<Daily>(
    "dailies",
    "/api/daily/all"
  )

  const addMutation = async (daily: DailyAddData) =>
    fetchFn(`/api/daily/add`, "POST", JSON.stringify(daily))

  type CheckResponse = { activities: Activity[]; dailies: Daily[] }

  // TODO @Peto: fix type inference with something like useMutation<CheckResponse>
  const checkDailyMutation = useMutation({
    mutationFn: (daily: Daily) =>
      fetchFn(`/api/daily/check/${daily.id}`, "POST"),
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["activities"],
        (data as CheckResponse).activities
      )
      queryClient.setQueryData(["dailies"], (data as CheckResponse).dailies)
    },
  }).mutate

  return {
    dailies: data,
    add: useMutation(mutationData(addMutation)).mutate,
    check: checkDailyMutation,
  }
}

export default useDailies
