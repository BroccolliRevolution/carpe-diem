import Activity from "core/activities/Activity"
import Command from "core/Command"
import DbGateway from "../DbGateway"

class GetDailyLogEntries implements Command {
  public constructor(private db: DbGateway) {}

  public execute() {
    return this.db.getDailyLogEntries()
  }
}

export default GetDailyLogEntries
