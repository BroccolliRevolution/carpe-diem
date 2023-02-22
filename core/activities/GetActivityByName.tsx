import Command from "core/Command"
import DbGateway from "../DbGateway"
import BasicName from "../types/BasicName"

class GetActivityByName implements Command {
  public constructor(private db: DbGateway) {}

  public execute(name: BasicName) {
    return this.db.getActivityByName(name)
  }
}

export default GetActivityByName
