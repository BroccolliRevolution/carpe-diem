import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect } from "react"
import { useQuery, useQueryClient } from "react-query"

async function fetchAuth() {
  const response = fetch("/api/auth-fe")
  return await (await response).json()
}

export default function Auth({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const { data } = useQuery("authenticated", fetchAuth)

  const isAuthorized = data?.content === "OK"
  if (session && isAuthorized) {
    return <>{children}</>
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}
