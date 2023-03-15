import { trpc } from "../utils/trpc"

export default function Haha() {
  const hello = trpc.activity.all.useQuery()
  if (!hello.data) {
    return <div>Loading...</div>
  }
  return (
    <div>
      <pre>{JSON.stringify(hello.data, null, 4)}</pre>
    </div>
  )
}
