import * as React from "react"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  }
}

interface Props {
  tabs: React.ReactNode[]
  titles: string[]
}

export default function BasicTabs(props: Props) {
  const { tabs, titles } = props
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {titles.map((tab, i) => {
            return (
              <Tab key={i + titles[i]} label={titles[i]} {...a11yProps(i)} />
            )
          })}
        </Tabs>
      </Box>
      {tabs.map((tab, i) => {
        return (
          <TabPanel key={i + titles[i] + "title"} value={value} index={i}>
            {tab}
          </TabPanel>
        )
      })}
    </Box>
  )
}
