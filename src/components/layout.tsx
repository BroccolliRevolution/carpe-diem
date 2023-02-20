import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import CssBaseline from "@mui/material/CssBaseline"
import { createTheme, styled, ThemeProvider } from "@mui/material/styles"
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
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              {children}
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  )
}
