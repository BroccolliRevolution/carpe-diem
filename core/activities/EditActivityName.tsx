import Activity from "./Activity"
import DbGateway from "../DbGateway"
import BasicName from "../types/BasicName"
import Command from "core/Command"

class getActivityByName implements Command {
  public constructor(private db: DbGateway) {}

  public execute(activity: Activity, name: BasicName) {
    this.db.editActivityName(activity, name)
  }
}

export default getActivityByName
