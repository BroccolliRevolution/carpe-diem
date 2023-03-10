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
