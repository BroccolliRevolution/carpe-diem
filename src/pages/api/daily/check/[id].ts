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
  const all = await activitiesRepo.all()
  res.json(all)
}
