import styled from "@emotion/styled"
import { CssBaseline } from "@mui/material"
import Box from "@mui/material/Box"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import Toolbar from "@mui/material/Toolbar"
import * as React from "react"

import Header from "./header"

const mdTheme = createTheme()

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider theme={mdTheme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <Header />
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Toolbar />
            <ContainerWrapper>{children}</ContainerWrapper>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  )
}

const ContainerWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
`
