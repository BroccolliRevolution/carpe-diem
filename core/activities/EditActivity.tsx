import Activity from "./Activity"
import DbGateway from "../DbGateway"
import BasicName from "../types/BasicName"
import Command from "core/Command"
import ActivityData from "./ActivityData"

class EditActivity implements Command {
  public constructor(private db: DbGateway) {}

  execute(id: number, data: ActivityData) {
    this.db.editActivity(id, data)
  }
}

export default EditActivity
