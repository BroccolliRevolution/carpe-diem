import { activitiesRepo } from "@/application/db/ActivitiesRepo"
import type { NextApiRequest, NextApiResponse } from "next"

export type ActivityData = { title: string; done: boolean }

export default async function handler(
  _: NextApiRequest,
  res: NextApiResponse<any>
) {
  const activities = await activitiesRepo.all()
  res.json(activities)
}
