// entity type

type Interval =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY"
  | "DAY"
  | "WEEK"
  | "MONTH"
  | "QUARTER"
  | "YEAR"

// TODO @Peto: rename to Goal?
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

export type DailyEditRequest = {
  title?: string
  priority?: number
}

export type DailyAddRequest = {
  title: string
}
