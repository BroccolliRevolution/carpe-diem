import { RouterOutputs, RouterInputs } from "./trpc"

export type Daily = RouterOutputs["daily"]["all"][0]
export type DailyAddData = RouterInputs["daily"]["add"]

// TODO @Peto:
// type DailyEditData
