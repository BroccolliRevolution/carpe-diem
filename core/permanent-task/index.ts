// entity type
export type PermanentTask = {
  id: number
  title: string
  active: boolean
  for_review: boolean
  note: string
  priority: number
  created_at: Date
}

export type PermanentTaskResponse = PermanentTask

export type PermanentTaskEditRequest = {
  title?: string
  priority?: number
}

export type PermanentTaskAddRequest = {
  title: string
}
