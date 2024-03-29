// entity type
export type Activity = {
  id: number
  title: string
  done: boolean
  done_at: Date | null
  created_at: Date
  priority: number
  // note: string | null
  // grade: number
}

export type ActivityResponse = Activity

export type ActivityEditRequest = {
  title?: string
  done?: boolean
  priority?: number
}

export type ActivityAddRequest = {
  title: string
}
