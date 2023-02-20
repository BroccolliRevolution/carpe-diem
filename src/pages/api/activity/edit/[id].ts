// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/db"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { id } = req.query
  const data = req.body

  if (!id) return

  await prisma.activities.update({
    where: { id: +id },
    data: { title: data?.title },
  })
  res.json(`edited id ${id}`)
}
