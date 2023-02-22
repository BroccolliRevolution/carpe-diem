// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import ActivitiesRepository from "application/db/ActivitiesRepository"
import DeleteActivity from "core/activities/DeleteActivity"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { id } = req.query
  if (!id) return

  new DeleteActivity(new ActivitiesRepository()).execute(+id)
}
