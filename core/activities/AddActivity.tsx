import Command from "core/Command"
import DbGateway from "core/DbGateway"
import Activity from "./Activity"
import GetActivity from "./GetActivity"

class AddActivity implements Command {
  public constructor(private db: DbGateway, private getActivity: GetActivity) {}

  public execute(activity: Activity) {
    if (this.getActivity.execute(activity.name))
      throw new Error(`Activity ${activity.name} already exists`)
    this.db.addActivity(activity)
  }
}

export default AddActivity
