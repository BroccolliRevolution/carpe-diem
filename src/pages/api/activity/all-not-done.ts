import type { NextApiRequest, NextApiResponse } from "next"
import { activitiesRepo } from "../../../../application/db/ActivitiesRepo"

export type ActivityData = { title: string; done: boolean }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const activities = await activitiesRepo.getAllNotDone()
  res.json(activities)
}
