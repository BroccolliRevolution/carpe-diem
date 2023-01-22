import Command from "core/Command"
import DbGateway from "../DbGateway"
import BasicName from "../types/BasicName"

class GetActivity implements Command {
  public constructor(private db: DbGateway) {}

  public execute(name: BasicName) {
    return this.db.getActivity(name)
  }
}

export default GetActivity
