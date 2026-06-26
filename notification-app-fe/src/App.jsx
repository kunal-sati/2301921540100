import { useState, useEffect, useMemo } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Container
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StarIcon from "@mui/icons-material/Star";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";

import { NotificationsPage } from "./pages/NotificationsPage";
import { PriorityInboxPage } from "./pages/PriorityInboxPage";
import { useNotifications } from "./hooks/useNotifications";
import { Log } from "../../logging-middleware/index.js";

const drawerWidth = 240;

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const notificationsState = useNotifications();
  const { unreadCount } = notificationsState;

  useEffect(() => {
    Log("frontend", "info", "utils", "Application startup completed");
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavClick = (index) => {
    setTabIndex(index);
    setMobileOpen(false);
    Log("frontend", "info", "page", `Navigation changed to tab ${index}`);
  };

  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#a5c8ff" : "#005dac"
      },
      background: {
        default: darkMode ? "#0f172a" : "#f8f9fa",
        paper: darkMode ? "#1e293b" : "#ffffff"
      },
      text: {
        primary: darkMode ? "#f8fafc" : "#191c1d",
        secondary: darkMode ? "#94a3b8" : "#414752"
      },
      divider: darkMode ? "rgba(255, 255, 255, 0.12)" : "#c1c6d4"
    },
    typography: {
      fontFamily: [
        "Inter",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        "sans-serif"
      ].join(",")
    }
  }), [darkMode]);

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Typography variant="subtitle1" fontWeight={700} color="primary.main">
          Student Hub
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Academic Year 2024
        </Typography>
      </Box>
      <Divider />
      <List sx={{ px: 2, py: 2, display: "flex", flexDirection: "column", gap: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            selected={tabIndex === 0}
            onClick={() => handleNavClick(0)}
            sx={{
              borderRadius: 2,
              py: 1.25,
              "&.Mui-selected": {
                bgcolor: "primary.main",
                color: "primary.contrastText",
                "& .MuiListItemIcon-root": { color: "primary.contrastText" },
                "&:hover": { bgcolor: "primary.main" }
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: tabIndex === 0 ? "inherit" : "text.secondary" }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" primaryTypographyProps={{ variant: "body2", fontWeight: tabIndex === 0 ? 700 : 500 }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            selected={tabIndex === 1}
            onClick={() => handleNavClick(1)}
            sx={{
              borderRadius: 2,
              py: 1.25,
              "&.Mui-selected": {
                bgcolor: "primary.main",
                color: "primary.contrastText",
                "& .MuiListItemIcon-root": { color: "primary.contrastText" },
                "&:hover": { bgcolor: "primary.main" }
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: tabIndex === 1 ? "inherit" : "text.secondary" }}>
              <StarIcon />
            </ListItemIcon>
            <ListItemText primary="Priority Inbox" primaryTypographyProps={{ variant: "body2", fontWeight: tabIndex === 1 ? 700 : 500 }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => Log("frontend", "info", "page", "Preferences mock clicked")}
            sx={{ borderRadius: 2, py: 1.25 }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "text.secondary" }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Preferences" primaryTypographyProps={{ variant: "body2", fontWeight: 500 }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => Log("frontend", "info", "page", "Support mock clicked")}
            sx={{ borderRadius: 2, py: 1.25 }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "text.secondary" }}>
              <HelpIcon />
            </ListItemIcon>
            <ListItemText primary="Support" primaryTypographyProps={{ variant: "body2", fontWeight: 500 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
        <AppBar
          position="fixed"
          sx={{
            width: { md: `calc(100% - ${drawerWidth}px)` },
            ml: { md: `${drawerWidth}px` },
            bgcolor: "background.paper",
            borderBottom: "1px solid",
            borderColor: "divider",
            color: "text.primary"
          }}
          elevation={0}
        >
          <Container maxWidth="lg">
            <Toolbar disableGutters sx={{ justifyContent: "space-between", px: { xs: 2, md: 3 } }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  color="inherit"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, display: { md: "none" } }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" fontWeight={800} color="primary.main">
                  Campus Notifications
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
                <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
                  {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
                
                <IconButton color="inherit">
                  <Badge badgeContent={unreadCount} color="error" max={99}>
                    <NotificationsIcon />
                  </Badge>
                </IconButton>

                <Avatar sx={{ bgcolor: "primary.main", color: "primary.contrastText", width: 32, height: 32, fontWeight: 700, fontSize: 13 }}>
                  JD
                </Avatar>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, borderRight: "1px solid", borderColor: "divider" }
            }}
          >
            {drawerContent}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, borderRight: "1px solid", borderColor: "divider" }
            }}
            open
          >
            {drawerContent}
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4 },
            width: { md: `calc(100% - ${drawerWidth}px)` },
            marginTop: "64px"
          }}
        >
          <Container maxWidth="lg" disableGutters>
            {tabIndex === 0 && <NotificationsPage {...notificationsState} />}
            {tabIndex === 1 && <PriorityInboxPage {...notificationsState} />}

            <Box
              component="footer"
              sx={{
                mt: 6,
                py: 3,
                borderTop: "1px solid",
                borderColor: "divider",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2
              }}
            >
              <Typography variant="caption" color="text.secondary">
                &copy; 2024 Campus Notification Systems
              </Typography>
              <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "center" }}>
                <Typography variant="caption" color="text.secondary" sx={{ cursor: "pointer", "&:hover": { color: "primary.main" } }}>
                  Privacy Policy
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ cursor: "pointer", "&:hover": { color: "primary.main" } }}>
                  Terms of Service
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ cursor: "pointer", "&:hover": { color: "primary.main" } }}>
                  Campus Directory
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}