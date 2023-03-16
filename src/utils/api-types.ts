import { RouterOutputs, RouterInputs } from "./trpc"

export type Daily = RouterOutputs["daily"]["all"][0]
export type DailyAddData = RouterInputs["daily"]["add"]

export type Activity = RouterOutputs["activity"]["all"][0]
export type ActivityEditData = RouterInputs["activity"]["edit"]
// TODO @Peto:
// type DailyEditData
