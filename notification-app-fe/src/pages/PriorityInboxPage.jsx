import { useState, useEffect, useMemo } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  Button
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { NotificationCard } from "../components/NotificationCard";
import { useNotifications } from "../hooks/useNotifications";
import { Log } from "../../../logging-middleware/index.js";

export function PriorityInboxPage(props) {
  const localState = useNotifications();
  const state = props.allNotifications !== undefined ? props : localState;
  const { allNotifications, readIds, loading, error, markAsRead, refresh } = state;
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    Log("frontend", "info", "page", "Priority page opened");
  }, []);

  const handleLimitChange = (event) => {
    const newLimit = event.target.value;
    setLimit(newLimit);
    Log("frontend", "info", "page", `Priority count changed to ${newLimit}`);
  };

  const priorityNotifications = useMemo(() => {
    const placements = [];
    const results = [];
    const events = [];
    const other = [];

    for (const item of allNotifications) {
      if (!item || !item.Type) {
        continue;
      }
      const type = item.Type.toLowerCase();
      if (type === "placement") {
        placements.push(item);
      } else if (type === "result") {
        results.push(item);
      } else if (type === "event") {
        events.push(item);
      } else {
        other.push(item);
      }
    }

    const sortByTimestamp = (a, b) => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();

    placements.sort(sortByTimestamp);
    results.sort(sortByTimestamp);
    events.sort(sortByTimestamp);
    other.sort(sortByTimestamp);

    return [...placements, ...results, ...events, ...other].slice(0, limit);
  }, [allNotifications, limit]);

  return (
    <Box sx={{ py: 2 }}>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "flex-end" },
          gap: 3
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flexGrow: 1 }}>
          <Typography variant="h4" fontWeight={800} color="text.primary">
            Priority Inbox
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640 }}>
            Critical updates from the Registrar, Placement Cell, and Campus Administration requiring your immediate attention.
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} sx={{ minWidth: { xs: "100%", sm: "auto" } }}>
          <FormControl size="small" sx={{ minWidth: 120, flexGrow: { xs: 1, sm: 0 } }}>
            <InputLabel id="priority-limit-label">Show</InputLabel>
            <Select
              labelId="priority-limit-label"
              value={limit}
              label="Show"
              onChange={handleLimitChange}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value={10}>Top 10</MenuItem>
              <MenuItem value={15}>Top 15</MenuItem>
              <MenuItem value={20}>Top 20</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="outlined"
            size="medium"
            startIcon={<RefreshIcon />}
            onClick={refresh}
            disabled={loading}
            sx={{ borderRadius: 2, textTransform: "none", py: 0.75, px: 2 }}
          >
            Refresh
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress size={48} />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" variant="outlined" sx={{ borderRadius: 3 }}>
          Failed to load priority notifications: {error}
        </Alert>
      )}

      {!loading && !error && priorityNotifications.length === 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 10,
            px: 2,
            textAlign: "center"
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 120,
              height: 120,
              borderRadius: "50%",
              bgcolor: "rgba(56, 189, 248, 0.05)",
              color: "primary.main",
              mb: 3
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 72 }} />
          </Box>
          <Typography variant="h5" fontWeight={800} color="text.primary" gutterBottom>
            Your priority inbox is clear
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 420, mb: 4 }}>
            Great job! You've addressed all urgent campus notifications for now. We'll alert you if anything critical arises.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={refresh}
            sx={{ textTransform: "none", borderRadius: 2.5, px: 4, py: 1.25, fontWeight: 700 }}
          >
            Refresh Inbox
          </Button>
        </Box>
      )}

      {!loading && !error && priorityNotifications.length > 0 && (
        <Stack spacing={2}>
          {priorityNotifications.map((n, index) => (
            <NotificationCard
              key={n.ID}
              notification={n}
              isRead={readIds.includes(n.ID)}
              onMarkAsRead={markAsRead}
              rank={index + 1}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}
