import { dailiesRepo } from "application/db/DailiesRepo"
import type { NextApiRequest, NextApiResponse } from "next"

export type ActivityData = { title: string; done: boolean }

export default async function handler(
  _: NextApiRequest,
  res: NextApiResponse<any>
) {
  const dailies = await dailiesRepo.all()
  res.json(dailies)
}
