import Activity from "./Activity"
import DbGateway from "../DbGateway"
import BasicName from "../types/BasicName"

// TODO @Peto: implements Command?
class EditActivity {
  public constructor(private db: DbGateway) {}

  public name(activity: Activity, name: BasicName) {
    this.db.editActivityName(activity, name)
  }

  public priority(activity: Activity, priority: number) {
    this.db.editActivityPriority(activity, priority)
  }
}

export default EditActivity
