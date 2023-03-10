import type { NextApiRequest, NextApiResponse } from "next"

import { activitiesRepo } from "application/db/ActivitiesRepo"
import { ActivityAddRequest } from "core/activity"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  await activitiesRepo.add(req.body as ActivityAddRequest)
  const activities = await activitiesRepo.all()
  res.json(activities)
}
