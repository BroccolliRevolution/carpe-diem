import { ActivityTitle } from "./types"

export interface Activity {
  readonly id: number
  readonly title: ActivityTitle
  readonly done: boolean
  readonly priority: number
  readonly date: string
}
