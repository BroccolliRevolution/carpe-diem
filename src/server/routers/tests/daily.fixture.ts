import { intervals } from "@/core/daily"
import { DailyAddData } from "@/utils/api-types"
import { faker } from "@faker-js/faker"

export const inputAdd: DailyAddData = {
  title: "daily test",
  periodicity: "DAY",
}

// TODO @Peto:
//https://fakerjs.dev/guide/usage.html

const COUNT = 5
const DAYLIES_MIN = 4

export const seeds = (): DailyAddData[] => {
  let res = [] as DailyAddData[]
  for (var i = 0; i < COUNT; i++) {
    res = [
      ...res,
      {
        title: faker.music.songName() + ", " + faker.color.human(),
        periodicity:
          i < DAYLIES_MIN
            ? "DAY"
            : intervals[Math.floor(Math.random() * intervals.length)],
      },
    ]
  }

  return res
}
