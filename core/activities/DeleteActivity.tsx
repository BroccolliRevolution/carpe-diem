import Command from "core/Command"
import DbGateway from "core/DbGateway"
import Activity from "./Activity"

class DeleteActivity implements Command {
  public constructor(private db: DbGateway) {}

  public execute(activityId: number) {
    this.db.deleteActivity(activityId)
  }
}

export default DeleteActivity
