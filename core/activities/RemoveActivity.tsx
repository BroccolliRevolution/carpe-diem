import Command from "core/Command"
import DbGateway from "core/DbGateway"
import Activity from "./Activity"

class RemoveActivity implements Command {
  public constructor(private db: DbGateway) {}

  public execute(activity: Activity) {
    this.db.removeActivity(activity)
  }
}

export default RemoveActivity
