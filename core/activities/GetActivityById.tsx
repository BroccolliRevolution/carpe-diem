import Command from "core/Command"
import DbGateway from "../DbGateway"
import BasicName from "../types/BasicName"

class GetActivityById implements Command {
  public constructor(private db: DbGateway) {}

  public execute(id: number) {
    return this.db.getActivityById(id)
  }
}

export default GetActivityById
