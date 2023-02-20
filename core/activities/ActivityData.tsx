interface Acti {
  done: boolean
  name: string
}

class ActivityData implements Acti {
  public done = false
  public constructor(
    public readonly name: string,
    public readonly date: string
  ) {}
}

export default ActivityData
