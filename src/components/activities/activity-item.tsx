import styled from "@emotion/styled"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import SaveIcon from "@mui/icons-material/Save"

import {
  Badge,
  Card,
  Checkbox,
  IconButton,
  Link,
  TextField,
  Tooltip,
} from "@mui/material"
import { useRef, useState } from "react"
import { formatDate, formatTime, today } from "../common/dateTime"
import { Activity, EditType } from "./useActivities"

type Props = {
  activity: Activity
  checkable: boolean
  deleteActivity: (activity: Activity) => void
  editActivity: (data: EditType) => void
  editPriority: (activity: Activity, direction: "UP" | "DOWN") => void
  checkActivity: (activity: Activity) => void
  repeatActivityToday: (activity: Activity) => void
}

const ChoppedTitle = ({ title }: { title: string }) => {
  const maxLength = 80
  const [fullText, setFullText] = useState(false)

  if (title.length <= maxLength) return <>{title}</>

  if (fullText)
    return (
      <>
        {title}{" "}
        <Link
          onClick={(e) => {
            e.preventDefault()
            setFullText(false)
          }}
          href="#"
        >
          Show Less
        </Link>
      </>
    )

  return (
    <>
      {title.substring(0, maxLength)}{" "}
      <Link
        onClick={(e) => {
          e.preventDefault()
          setFullText(true)
        }}
        href="#"
      >
        ...
      </Link>
    </>
  )
}

const ActivityItem = ({
  activity,
  checkable,
  deleteActivity,
  editActivity,
  checkActivity,
  repeatActivityToday,
  editPriority,
}: Props) => {
  const [title, setTitle] = useState<string>(activity.title)
  const [editing, setEditing] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const titleText = useRef(null)

  const isTodaysActivity = formatDate(activity.created_at) === today()

  return (
    <ListItem
      key={activity.id}
      style={{
        border: " 1px solid #00000047",
        borderRadius: 5,
        display: "flex",
      }}
    >
      <div style={{ display: "flex", position: "relative" }}>
        {showOptions && (
          <CloseOptions
            badgeContent="x"
            color="warning"
            onClick={() => setShowOptions(false)}
            style={{
              zIndex: 101,
            }}
          />
        )}
        <IconButton
          size="small"
          aria-label="priority down"
          component="label"
          onClick={() => setShowOptions(!showOptions)}
        >
          <MoreHorizIcon />
        </IconButton>

        {isTodaysActivity && !activity.done && (
          <>
            <IconButton
              size="small"
              aria-label="priority up"
              component="label"
              onClick={() => editPriority(activity, "UP")}
            >
              <ArrowUpwardIcon />
            </IconButton>
            <IconButton
              size="small"
              aria-label="priority down"
              component="label"
              onClick={() => editPriority(activity, "DOWN")}
            >
              <ArrowDownwardIcon />
            </IconButton>
          </>
        )}

        <div
          style={{
            display: showOptions ? "flex" : "none",
            position: "absolute",
            zIndex: 100,
          }}
        >
          <Card variant="outlined">
            <IconButton
              size="small"
              color="error"
              aria-label="delete activity"
              component="label"
              onClick={() => deleteActivity(activity)}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              size="small"
              aria-label="edit activity"
              component="label"
              onClick={() => {
                setShowOptions(false)
                setEditing(!editing)
              }}
            >
              <EditIcon />
            </IconButton>
          </Card>
        </div>

        {!isTodaysActivity && (
          <Tooltip placement="top" arrow={true} title="repeat again today">
            <IconButton
              size="small"
              aria-label="repeat again today"
              component="label"
              onClick={() => {
                repeatActivityToday(activity)
              }}
            >
              <RestartAltIcon />
            </IconButton>
          </Tooltip>
        )}

        {editing && (
          <IconButton
            size="small"
            aria-label="edit activity"
            component="label"
            onClick={() => {
              editActivity({
                activity,
                activityData: { id: activity.id, title },
              })
              setEditing(!editing)
            }}
          >
            <SaveIcon />
          </IconButton>
        )}
      </div>

      {!editing ? (
        <ActivityTitle>
          <Tooltip
            placement="top"
            arrow={true}
            title={formatTime(activity?.done_at ?? activity.created_at)}
          >
            <span style={{ padding: 5 }}>
              <ChoppedTitle title={activity.title} />
            </span>
          </Tooltip>
        </ActivityTitle>
      ) : (
        <TextField
          ref={titleText}
          fullWidth
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
          autoFocus
          onKeyDown={(ev) => {
            if (ev.key === "Enter") {
              ev.preventDefault()

              editActivity({
                activity,
                activityData: { id: activity.id, title },
              })
              setEditing(!editing)
            }
          }}
        />
      )}

      <div style={{ minWidth: 30 }}>
        {checkable && (
          <Checkbox
            checked={activity.done}
            onChange={() => checkActivity(activity)}
          />
        )}
      </div>
    </ListItem>
  )
}

const CloseOptions = styled(Badge)`
  :hover {
    cursor: pointer;
  }
`
const ListItem = styled.li`
  display: flex;
  justify-content: space-between;

  flex-wrap: wrap;
  margin: 2px;

  @media (min-width: 600px) {
    min-width: 350px;
    max-width: 450px;
  }
`
const ActivityTitle = styled.div`
  display: flex;
  align-items: center;
  flex: 1 1 65%;
  justify-content: flex-start;
  border-left: 1px solid rgb(0 0 0 / 24%);

  @media (max-width: 500px) {
    flex: 1 1 50%;
  }
`

export default ActivityItem
