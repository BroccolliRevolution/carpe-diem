class BasicName {
  private _value: string
  public static MAX_LENGTH = 30

  constructor(val: string) {
    const value = val.trim()
    this.validate(value)
    this._value = value
  }

  validate(val: string) {
    if (!val || val.length > BasicName.MAX_LENGTH) {
      throw new Error(`invalid ActivityName value: ${val}`)
    }
  }

  get value() {
    return this._value
  }

  toEquals(other: BasicName): boolean {
    return this._value === other.value
  }

  toString() {
    return this._value
  }
}

export default BasicName
