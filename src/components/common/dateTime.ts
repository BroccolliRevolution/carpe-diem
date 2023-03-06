import dayjs from "dayjs"

const dateTemplate = "DD/MM/YYYY"
const timeTemplate = "HH:mm:ss"

export const formatDate = (date: string) => {
  return dayjs(date).format(dateTemplate)
}

export const formatTime = (date: string) => {
  return dayjs(date).format(timeTemplate)
}

export const today = () => {
  return dayjs().format(dateTemplate)
}
