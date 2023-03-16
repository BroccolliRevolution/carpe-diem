import { RouterOutputs, RouterInputs } from "./trpc"

export type Daily = RouterOutputs["daily"]["all"][0]
export type DailyAddData = RouterInputs["daily"]["add"]

// TODO @Peto:
// type DailyEditData

// TODO @Peto: can I rather infer this from tRPC somehow?
export const intervals = [
  "DAY",
  "WEEK",
  "MONTH",
  "QUARTER",
  "YEAR",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const

export type Interval = Daily["periodicity"]
