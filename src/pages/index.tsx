import { Grid, Paper } from "@mui/material"
import { useEffect, useRef, useState } from "react"

function Home() {
  const [count, setCount] = useState(0)

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8} lg={9}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 240,
          }}
        >
          {/* <Chart /> */}
          CHART HERE
        </Paper>
      </Grid>
      {/* Recent Deposits */}
      <Grid item xs={12} md={4} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 240,
          }}
        >
          {/* <Deposits /> */}
          Deposits
        </Paper>
      </Grid>
      {/* Recent Orders */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          Orders
        </Paper>
      </Grid>
    </Grid>
  )
}
export default Home
