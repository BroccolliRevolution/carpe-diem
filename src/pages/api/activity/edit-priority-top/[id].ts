import type { NextApiRequest, NextApiResponse } from "next"
import { activitiesRepo } from "./../../../../../application/db/ActivitiesRepo"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { id } = req.query
  if (!id) return

  await activitiesRepo.editPriorityTop(+id)
  const activities = await activitiesRepo.getAllActivities()
  res.json(activities)
}
