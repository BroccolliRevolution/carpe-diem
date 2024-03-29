import { Daily } from "@/utils/api-types"
import styled from "@emotion/styled"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"
import CheckIcon from "@mui/icons-material/Check"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"

import { IconButton, Tooltip } from "@mui/material"
import { useState } from "react"
import { PropType } from "../common"
import { ChoppedTitle } from "../common/ChoppedTitle"

type Props = {
  daily: Daily
  check: (id: number) => void
  editing: () => void
  editPriority: ({
    id,
    priority,
  }: {
    id: PropType<Daily, "id">
    priority: PropType<Daily, "priority">
  }) => void
  editPriorityTop: (daily: Daily) => void
}

const DailyItem = ({
  daily,
  check,
  editPriority,
  editPriorityTop,
  editing,
}: Props) => {
  const [editinsg, setEditing] = useState(false)

  const [showOptions, setShowOptions] = useState(false)

  return (
    <ListItem
      key={daily.id + daily.title}
      style={{
        border: " 1px solid #00000047",
        borderRadius: 5,
        display: "flex",
      }}
    >
      <div style={{ display: "flex", position: "relative" }}>
        <IconButton
          size="small"
          aria-label="priority up"
          component="label"
          onClick={() =>
            editPriority({
              id: daily.id,
              priority: daily.priority + 1,
            })
          }
        >
          <ArrowUpwardIcon />
        </IconButton>
        <IconButton
          size="small"
          aria-label="priority down"
          component="label"
          onClick={() =>
            editPriority({
              id: daily.id,
              priority: daily.priority - 1,
            })
          }
        >
          <ArrowDownwardIcon />
        </IconButton>

        <IconButton
          size="small"
          aria-label="edit activity"
          component="label"
          onClick={() => {
            setShowOptions(false)
            setEditing(!editing)
            editing()
          }}
        >
          <MoreHorizIcon />
        </IconButton>
      </div>

      <ActivityTitle>
        <Tooltip placement="top" arrow={true} title="">
          <span style={{ padding: 5 }}>
            {/* <span>{daily.periodicity}</span>{" "} */}
            <ChoppedTitle title={daily.title} />
          </span>
        </Tooltip>
      </ActivityTitle>

      <IconButton
        size="small"
        aria-label="priority down"
        component="label"
        color="success"
        onClick={() => check(daily.id)}
      >
        <CheckIcon />
      </IconButton>
    </ListItem>
  )
}

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

export default DailyItem
