import { ActivityEditRequest } from "core/activity"
import { activitiesRepo } from "./../../../../../application/db/ActivitiesRepo"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { id } = req.query
  const data: ActivityEditRequest = req.body

  if (!id) return

  console.log(data)

  await activitiesRepo.editActivity(data)
  res.json(`edited id ${id}`)
}
