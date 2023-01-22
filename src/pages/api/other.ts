// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import { getToken } from "next-auth/jwt"

type Data = {
  name: string
  other: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  setTimeout(() => res.json("Test here"), 1000)
}
