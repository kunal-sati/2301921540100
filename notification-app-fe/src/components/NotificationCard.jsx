import { useState } from "react";
import { Card, Box, Chip, Typography, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckIcon from "@mui/icons-material/Check";

export function NotificationCard({ notification, isRead, onMarkAsRead, rank }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    if (event) {
      event.stopPropagation();
    }
    setAnchorEl(null);
  };

  const handleMarkRead = (event) => {
    event.stopPropagation();
    onMarkAsRead(notification.ID);
    setAnchorEl(null);
  };

  const getBadgeColor = (type) => {
    const t = type.toLowerCase();
    if (t === "placement") return "info";
    if (t === "result") return "secondary";
    return "warning";
  };

  const getBorderColor = (type) => {
    const t = type.toLowerCase();
    if (t === "placement") return "#0288d1";
    if (t === "result") return "#9c27b0";
    return "#ed6c02";
  };

  const formattedRank = rank !== undefined ? (rank < 10 ? `0${rank}` : `${rank}`) : "";

  return (
    <Card
      variant="outlined"
      onClick={() => onMarkAsRead(notification.ID)}
      sx={{
        borderRadius: 3,
        borderLeft: isRead ? "6px solid transparent" : `6px solid ${getBorderColor(notification.Type)}`,
        backgroundColor: isRead ? "transparent" : "rgba(255, 255, 255, 0.02)",
        transition: "all 0.2s ease",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "action.hover"
        }
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          p: 2.5,
          gap: 2
        }}
      >
        {rank !== undefined && (
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{
              minWidth: 32,
              textAlign: "center",
              color: rank <= 2 ? "primary.main" : "text.secondary",
              lineHeight: 1
            }}
          >
            {formattedRank}
          </Typography>
        )}

        <Box sx={{ minWidth: 100 }}>
          <Chip
            label={notification.Type}
            size="small"
            color={getBadgeColor(notification.Type)}
            variant="filled"
            sx={{ fontWeight: 700, fontSize: 11, borderRadius: 1.5 }}
          />
        </Box>

        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: isRead ? 500 : 700,
              color: isRead ? "text.secondary" : "text.primary",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: { sm: "nowrap" }
            }}
          >
            {notification.Message}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: { xs: "100%", sm: "auto" },
            gap: 2,
            mt: { xs: 1, sm: 0 },
            borderTop: { xs: "1px solid", sm: "none" },
            borderColor: "divider",
            pt: { xs: 1.5, sm: 0 }
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
            {notification.Timestamp}
          </Typography>

          <IconButton size="small" onClick={handleClick}>
            <MoreVertIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem onClick={handleMarkRead} disabled={isRead}>
            <ListItemIcon>
              <CheckIcon sx={{ fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText primary="Mark as read" primaryTypographyProps={{ variant: "body2" }} />
          </MenuItem>
        </Menu>
      </Box>
    </Card>
  );
}
