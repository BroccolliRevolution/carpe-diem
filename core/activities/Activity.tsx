import BasicName from "../types/BasicName"

class Activity {
  public done = false
  // TODO @Peto: score field
  public constructor(
    public name: BasicName,
    public priority: number,
    public readonly date: string
  ) {}

  public toggleCheck() {
    this.done = !this.done
  }
}

export default Activity
