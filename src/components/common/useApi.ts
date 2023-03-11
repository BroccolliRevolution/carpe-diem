import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

type HttpMethod = "GET" | "POST" | "DELETE" | "UPDATE" | "PATCH"
export const fetchFn = async <T>(
  url: string,
  method: HttpMethod,
  body?: BodyInit
): Promise<T> => {
  return await (
    await fetch(url, {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
    })
  ).json()
}

export const useApi = <T>(queryKey: string, fetchAllUrl: string) => {
  const queryClient = useQueryClient()

  const fetchData = async () => {
    const res = (await (await fetch(fetchAllUrl)).json()) as unknown as T[]

    // TODO @Peto: validate for type? from API call?
    return res
  }
  const data =
    useQuery({
      queryKey: [queryKey],
      queryFn: fetchData,
      // refetchInterval: 2000,
    }).data ?? []

  const mutationData = <T, D>(
    fn: (...args: T[]) => Promise<D>,
    success?: (data: any) => void
  ): {
    mutationFn: (...args: T[]) => Promise<D>
    onSuccess: (data: D) => void
  } => ({
    mutationFn: fn,
    onSuccess: (data: any) => {
      if (success !== undefined) success(data)
      queryClient.setQueryData([queryKey], data)
    },
  })

  return {
    mutationData,
    queryClient,
    useMutation,
    data,
  }
}
