// entity type
export type Daily = {
  id: number
  title: string
  created_at: Date
  active: boolean
  for_review: boolean
  note: string | null
  priority: number
  importance: number
}

export type DailyResponse = Daily

export type DailyEditRequest = {
  title?: string
  priority?: number
}

export type DailyAddRequest = {
  title: string
}
