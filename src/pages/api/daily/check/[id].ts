import { dailiesRepo } from "application/db/DailiesRepo"
import { activitiesRepo } from "application/db/ActivitiesRepo"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { id } = req.query
  if (!id) return

  await dailiesRepo.toggle(+id)
  const activities = await activitiesRepo.all()
  const dailies = await dailiesRepo.all()
  res.json({ activities, dailies })
}
