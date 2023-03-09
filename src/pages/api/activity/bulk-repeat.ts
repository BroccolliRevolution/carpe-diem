import type { NextApiRequest, NextApiResponse } from "next"

import { activitiesRepo } from "application/db/ActivitiesRepo"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  await activitiesRepo.bulkRepeatToday(req.body as number[])
  const activities = await activitiesRepo.getAllActivities()
  res.json(activities)
}
