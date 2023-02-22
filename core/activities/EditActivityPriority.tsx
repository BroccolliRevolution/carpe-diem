import Command from "core/Command"
import DbGateway from "../DbGateway"
import Activity from "./Activity"

class EditActivityPriority implements Command {
  public constructor(private db: DbGateway) {}

  public execute(activity: Activity, priority: number) {
    this.db.editActivityPriority(activity, priority)
  }
}

export default EditActivityPriority
