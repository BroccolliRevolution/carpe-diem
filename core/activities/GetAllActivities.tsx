import Command from "core/Command"
import DbGateway from "core/DbGateway"

class GetAllActivities implements Command {
  public constructor(private db: DbGateway) {}

  public execute() {
    return this.db.getAllActivities()
  }
}

export default GetAllActivities
