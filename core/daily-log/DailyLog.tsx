import Activity from "core/activities/Activity"

class DailyLog {
  public constructor(
    public activity: Activity,
    public date: Date,
    public score: number
  ) {}
}

export default DailyLog
