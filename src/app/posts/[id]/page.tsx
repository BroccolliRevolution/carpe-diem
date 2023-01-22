import { prisma } from "@/db"
import InnerHere from "./InnerHere"

const getData = async () => {
  return new Promise((reslove, reject) => {
    setTimeout(() => {
      reslove({
        id: 1,
        title: "ako sa mas",
      })
    }, 3000)
  })
}

const Post = async ({ params }: { params: { id: string } }) => {
  const movie = await prisma.post.findFirst({
    where: {
      id: +params.id,
    },
  })

  // const movie = (await getData()) as { title: string }
  return (
    <div>
      <h1>{movie?.title}</h1>
      <h1>{params.id}</h1>
      <InnerHere></InnerHere>
    </div>
  )
}

export default Post
