import { activitiesRepo } from "@/application/db/ActivitiesRepo"
import { ActivityEditRequest } from "@/core/activity"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { id } = req.query
  const data: ActivityEditRequest = req.body

  if (!id) return

  await activitiesRepo.edit(+id, data)
  const activities = await activitiesRepo.all()
  res.json(activities)
}
