import Command from "core/Command"
import DbGateway from "core/DbGateway"
import Activity from "./Activity"

class AddActivity implements Command {
  public constructor(private db: DbGateway) {}

  public execute(activity: Activity) {
    this.db.addActivity(activity)
  }
}

export default AddActivity
