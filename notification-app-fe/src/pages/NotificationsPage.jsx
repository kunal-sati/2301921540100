import { useEffect } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  Pagination,
  Stack,
  Typography,
  Button
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import InboxIcon from "@mui/icons-material/Inbox";

import { NotificationCard } from "../components/NotificationCard";
import { NotificationFilter } from "../components/NotificationFilter";
import { useNotifications } from "../hooks/useNotifications";
import { Log } from "../../../logging-middleware/index.js";

export function NotificationsPage(props) {
  const localState = useNotifications();
  const state = props.notifications !== undefined ? props : localState;
  const {
    notifications,
    readIds,
    totalPages,
    loading,
    error,
    page,
    filter,
    setFilter,
    setPage,
    markAsRead,
    refresh
  } = state;

  useEffect(() => {
    Log("frontend", "info", "page", "Notifications list page loaded");
  }, []);

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ mb: 4, display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="h4" fontWeight={800} color="text.primary">
          Notifications Feed
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Academic updates, placement drives, and campus announcements published for students.
        </Typography>
      </Box>

      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2
        }}
      >
        <NotificationFilter value={filter} onChange={setFilter} />
        
        <Button
          variant="outlined"
          size="medium"
          startIcon={<RefreshIcon />}
          onClick={refresh}
          disabled={loading}
          sx={{ borderRadius: 2, textTransform: "none", py: 0.75, px: 2 }}
        >
          Refresh Feed
        </Button>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress size={48} />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" variant="outlined" sx={{ borderRadius: 3 }}>
          Failed to load notifications: {error}
        </Alert>
      )}

      {!loading && !error && notifications.length === 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
            px: 2,
            textAlign: "center",
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 4,
            bgcolor: "background.paper"
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: "action.selected",
              color: "text.secondary",
              mb: 3
            }}
          >
            <InboxIcon sx={{ fontSize: 40 }} />
          </Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            No notifications found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320, mb: 3 }}>
            There are no notifications published matching the "{filter}" category filter.
          </Typography>
          <Button variant="outlined" size="small" onClick={() => setFilter("All")} sx={{ textTransform: "none", borderRadius: 2 }}>
            Clear Filters
          </Button>
        </Box>
      )}

      {!loading && !error && notifications.length > 0 && (
        <Stack spacing={2}>
          {notifications.map((n) => (
            <NotificationCard
              key={n.ID}
              notification={n}
              isRead={readIds.includes(n.ID)}
              onMarkAsRead={markAsRead}
            />
          ))}
        </Stack>
      )}

      {!loading && !error && totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            color="primary"
            shape="rounded"
            size="medium"
          />
        </Box>
      )}
    </Box>
  );
}
