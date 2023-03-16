import { activitiesRepo } from "@/application/db/ActivitiesRepo"
import "@testing-library/jest-dom"
test.only("nill", async () => {
  const m = await activitiesRepo.all()
  console.log(m.length)
})
