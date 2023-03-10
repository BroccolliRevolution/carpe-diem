import { dailiesRepo } from "./../../../../application/db/DailiesRepo"
import type { NextApiRequest, NextApiResponse } from "next"

import { activitiesRepo } from "application/db/ActivitiesRepo"
import { ActivityAddRequest } from "core/activity"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  await dailiesRepo.add(req.body as ActivityAddRequest)
  const dailies = await dailiesRepo.all()
  res.json(dailies)
}
