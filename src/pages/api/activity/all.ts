// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/db"
import type { NextApiRequest, NextApiResponse } from "next"

export type ActivityData = { title: string; done: boolean }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const activities = await prisma.activities.findMany({
    orderBy: { id: "asc" },
  })
  res.json(activities)
}
