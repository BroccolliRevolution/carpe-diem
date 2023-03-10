import { useMutation, useQuery, useQueryClient } from "react-query"
import { fetchFn } from "../common/api"

export type Daily = {
  id: number
  title: string
  created_at: string
  active: boolean
  for_review: boolean
  note: string | null
  priority: number
  importance: number
}

export type DailyAddData = {
  title: string
  priority?: number
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
  const queryClient = useQueryClient()

  const fetchDailies = async () => {
    const res = (await (
      await fetch("/api/daily/all")
    ).json()) as unknown as Daily[]

    // TODO @Peto: validate for type? from API call?
    return res
  }

  const addMutation = async (daily: DailyAddData) =>
    fetchFn(`/api/daily/add`, "POST", JSON.stringify(daily))

  const checkDailyMutation = useMutation({
    mutationFn: (daily: Daily) =>
      fetchFn(`/api/daily/check/${daily.id}`, "POST"),
    onSuccess: (data) => {
      queryClient.setQueryData(["activities"], data)
    },
  }).mutate

  const dailies =
    useQuery({
      queryKey: ["dailies"],
      queryFn: fetchDailies,
      // refetchInterval: 2000,
    }).data ?? []

  const mutationData = <T, D>(
    fn: (...args: T[]) => Promise<D>
  ): {
    mutationFn: (...args: T[]) => Promise<D>
    onSuccess: (data: D) => void
  } => ({
    mutationFn: fn,
    onSuccess: (data: unknown) => {
      queryClient.setQueryData(["dailies"], data)
    },
  })

  return {
    dailies,
    add: useMutation(mutationData(addMutation)).mutate,
    check: checkDailyMutation,
  }
}

export default useDailies
