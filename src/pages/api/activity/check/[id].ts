// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/db"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { id, data } = req.query
  if (!id) return

  const activity = await prisma.activities.findFirst({ where: { id: +id } })
  await prisma.activities.update({
    where: { id: +id },
    data: { done: !activity?.done },
  })
  res.json(`edited id ${id}`)
}
