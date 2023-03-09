import { activitiesRepo } from "application/db/ActivitiesRepo"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { id } = req.query
  if (!id) return

  await activitiesRepo.deleteActivity(+id)
  const activities = await activitiesRepo.getAllActivities()
  res.json(activities)
}
