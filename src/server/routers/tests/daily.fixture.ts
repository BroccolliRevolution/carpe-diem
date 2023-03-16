import { DailyAddData } from "@/utils/api-types"

export const inputAdd: DailyAddData = {
  title: "daily test",
  periodicity: "DAY",
}

// TODO @Peto:
//https://fakerjs.dev/guide/usage.html

export const seeds: DailyAddData[] = [
  {
    title: "first one",
    periodicity: "DAY",
  },
  {
    title: "other",
    periodicity: "DAY",
  },
  {
    title: "yet something else",
    periodicity: "WEEK",
  },
]
