import BasicName from "../types/BasicName"
import ActivityData from "./ActivityData"

class Activity {
  // TODO @Peto: score field
  public readonly title: BasicName
  public readonly priority: number
  public readonly id: number
  public readonly date: string
  public done: boolean = false
  public constructor(data: ActivityData) {
    this.title = new BasicName(data.title ?? "")
    this.priority = data.priority ?? 0
    this.id = data.id ?? 0
    this.date = data.date ?? ""
    this.done = data.done ?? false
  }

  public toggleCheck() {
    this.done = !this.done
  }
}

export default Activity
