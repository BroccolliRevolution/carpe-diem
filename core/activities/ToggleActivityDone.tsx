import Command from "core/Command"
import AddToDailyLog from "core/daily-log/AddToDailyLog"
import DbGateway from "../DbGateway"
import Activity from "./Activity"

class ToggleActivityDone implements Command {
  public constructor(
    private db: DbGateway,
    private addToDailyLog: AddToDailyLog
  ) {}

  public execute(activity: Activity, done: boolean) {
    this.db.toggleActivityDone(activity, done)
    this.addToDailyLog.execute(activity)
  }
}

export default ToggleActivityDone
