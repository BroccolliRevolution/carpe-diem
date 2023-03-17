export const intervals = [
  "DAY",
  "WEEK",
  "MONTH",
  "QUARTER",
  "YEAR",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const

export type Interval = typeof intervals[number]

// TODO @Peto: rename to Goal?
// entity type
export type Daily = {
  id: number
  title: string
  created_at: Date
  active: boolean
  note: string | null
  priority: number
  importance: number
  periodicity: Interval
  parentId: number | null
  labelId: number | null
}

export type DailyResponse = Daily

// TODO @Peto: what with these?
export type DailyEditRequest = {
  title?: string
  priority?: number
}

export type DailyAddRequest = {
  title: string
}
