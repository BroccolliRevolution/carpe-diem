// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  // @ts-expect-error options
  const session = await getServerSession(req, res, authOptions)
  const authenticated = session?.user?.email === process.env.WHITE_LIST

  if (session && authenticated) {
    res.send({
      content: "OK",
    })
  } else {
    res.send({
      error:
        "You must be signed in to view the protected content on this page.",
    })
  }
}
