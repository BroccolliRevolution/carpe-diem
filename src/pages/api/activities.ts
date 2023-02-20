// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/db"
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
  const activities = await prisma.activities.findMany()
  res.json(activities)
}
