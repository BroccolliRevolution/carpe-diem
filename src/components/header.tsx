import MenuIcon from "@mui/icons-material/Menu"
import { AppBar, Box, Button, IconButton, Toolbar } from "@mui/material"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"
import { signOut } from "next-auth/react"

export default function Header() {
  const navItems = [
    { title: "Home", path: "/" },
    { title: "Edit", path: "/edit-activities" },
    { title: "Stats", path: "/stats" },
    { title: "goals", path: "/goals" },
  ]

  return (
    <>
      <AppBar>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            Carpe Diem
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item) => (
              <Link key={item.title} href={item.path}>
                <Button sx={{ color: "#fff" }}>{item.title}</Button>
              </Link>
            ))}

            <Button sx={{ color: "#fff" }} onClick={() => signOut()}>
              Sign out
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  )
}
