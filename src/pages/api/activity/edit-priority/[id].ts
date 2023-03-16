import { activitiesRepo } from "@/application/db/ActivitiesRepo"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { id } = req.query
  const priority = req.body

  if (!id) return

  await activitiesRepo.editPriority(+id, priority)
  const activities = await activitiesRepo.all()
  res.json(activities)
}
