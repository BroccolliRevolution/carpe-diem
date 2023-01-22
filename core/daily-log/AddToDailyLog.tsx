import Activity from "core/activities/Activity"
import Command from "core/Command"
import DbGateway from "../DbGateway"

class AddToDailyLog implements Command {
  public constructor(private db: DbGateway) {}

  public execute(activity: Activity) {
    return this.db.addToDailyLog(activity)
  }
}

export default AddToDailyLog
