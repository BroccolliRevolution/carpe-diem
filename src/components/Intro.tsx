import styled from "@emotion/styled"
import { Grid, useMediaQuery, useTheme } from "@mui/material"
import { Activities } from "./activities/activities"
import BasicTabs from "./common/BasicTabs"
import { Dailies } from "./dailies/dailies"

const DesktopView = () => {
  return (
    <>
      <Grid
        item
        alignItems="stretch"
        md={5}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <Activities type="todo" key="activities-todo" />
      </Grid>
      <Grid item md={4}>
        <Dailies key="dailies" />
      </Grid>
      <Grid item md={3}>
        <Activities type="done" key="activities-todo" />
      </Grid>
    </>
  )
}
const MobileView = () => {
  return (
    <>
      <Grid
        item
        xs={12}
        alignItems="flex-start"
        md={5}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <BasicTabs
          titles={["Dailies", "TODOS"]}
          tabs={[
            <Dailies key="dailies" />,
            <Activities type="todo" key="activities-todo" />,
          ]}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <Activities type="done" key="activities-todo" />
      </Grid>
    </>
  )
}

export const Intro = () => {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down("sm"))
  return (
    <GridStyled container spacing={3} height={"100%"}>
      {mobile ? <MobileView /> : <DesktopView />}
    </GridStyled>
  )
}

const GridStyled = styled(Grid)`
  @media (min-width: 600px) {
    padding: 20px;
  }
`
