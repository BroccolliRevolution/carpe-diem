import { ValueObject } from "../types/index"
export class ActivityTitle implements ValueObject<string, ActivityTitle> {
  private _value: string
  public static MAX_LENGTH = 30

  constructor(val: string) {
    const value = val.trim()
    this.validate(value)
    this._value = value
  }

  validate(val: string) {
    if (!val || val.length > ActivityTitle.MAX_LENGTH) {
      throw new Error(`invalid Activity Title value: ${val}`)
    }
  }

  get value() {
    return this._value
  }

  toEquals(other: ActivityTitle): boolean {
    return this._value === other.value
  }

  toString() {
    return this._value
  }
}

export class ActivityPriority implements ValueObject<number, ActivityPriority> {
  private _value: number
  public static MIN = 1
  public static MAX = 100000

  constructor(val: number) {
    this.validate(val)
    this._value = val
  }

  validate(val: number) {
    if (!val || val > ActivityPriority.MAX || val < ActivityPriority.MIN) {
      throw new Error(`invalid Activity Priority value: ${val}`)
    }
  }

  get value() {
    return this._value
  }

  toEquals(other: ActivityPriority): boolean {
    return this._value === other.value
  }

  toString() {
    return "" + this._value
  }
}
