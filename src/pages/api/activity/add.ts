import type { NextApiRequest, NextApiResponse } from "next"

import { activitiesRepo } from "application/db/ActivitiesRepo"
import { ActivityAddRequest } from "core/activity"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  await activitiesRepo.addActivity(req.body as ActivityAddRequest)
  const activities = await activitiesRepo.getAllActivities()
  res.json(activities)
}
