import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchNotifications } from "../api/notifications";
import { Log } from "../../../logging-middleware/index.js";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allNotifications, setAllNotifications] = useState([]);

  const [readIds, setReadIds] = useState(() => {
    try {
      const saved = localStorage.getItem("read_notification_ids");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const limit = 5;

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    await Log("frontend", "info", "hook", "API request started");
    try {
      const apiFilter = filter === "All" ? undefined : filter;
      const fullList = await fetchNotifications(undefined, undefined, apiFilter);
      const paginatedList = await fetchNotifications(page, limit, apiFilter);
      const allItems = await fetchNotifications();

      setTotalCount(fullList.length);
      setNotifications(paginatedList);
      setAllNotifications(allItems);
      await Log("frontend", "info", "hook", "API request succeeded");
    } catch (err) {
      setError(err.message);
      await Log("frontend", "error", "hook", `API request failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    let active = true;
    const fetchOnMount = async () => {
      try {
        const apiFilter = filter === "All" ? undefined : filter;
        const fullList = await fetchNotifications(undefined, undefined, apiFilter);
        const paginatedList = await fetchNotifications(page, limit, apiFilter);
        const allItems = await fetchNotifications();

        if (active) {
          setTotalCount(fullList.length);
          setNotifications(paginatedList);
          setAllNotifications(allItems);
          setLoading(false);
        }
      } catch (err) {
        if (active) {
          setError(err.message);
          setLoading(false);
        }
      }
    };
    fetchOnMount();
    return () => {
      active = false;
    };
  }, [page, filter]);

  const totalPages = useMemo(() => {
    return Math.ceil(totalCount / limit) || 1;
  }, [totalCount]);

  const markAsRead = useCallback(async (id) => {
    if (readIds.includes(id)) {
      return;
    }

    const updated = [...readIds, id];
    setReadIds(updated);
    try {
      localStorage.setItem("read_notification_ids", JSON.stringify(updated));
    } catch (err) {
      await Log("frontend", "error", "hook", `Failed to save read state: ${err.message}`);
    }
    await Log("frontend", "info", "hook", `Notification marked as read: ${id}`);
  }, [readIds]);

  const handleFilterChange = useCallback(async (newFilter) => {
    setFilter(newFilter);
    setPage(1);
    await Log("frontend", "info", "hook", `Filter changed to ${newFilter}`);
  }, []);

  const handlePageChange = useCallback(async (newPage) => {
    setPage(newPage);
    await Log("frontend", "info", "hook", `Pagination changed to page ${newPage}`);
  }, []);

  const unreadCount = allNotifications.filter((n) => !readIds.includes(n.ID)).length;

  return {
    notifications,
    allNotifications,
    unreadCount,
    readIds,
    totalPages,
    loading,
    error,
    page,
    filter,
    setFilter: handleFilterChange,
    setPage: handlePageChange,
    markAsRead,
    refresh
  };
}
