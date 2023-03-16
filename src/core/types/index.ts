export interface ValueObject<T, U> {
  value: T
  validate?: (val: T) => void | never
  toEquals: (other: U) => boolean
  toString?: () => string
}
