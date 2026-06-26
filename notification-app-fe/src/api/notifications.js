import { Log, getAuthToken } from "../../../logging-middleware/index.js";

const getEnv = (key, fallback) => {
  if (typeof globalThis !== "undefined" && globalThis.process && globalThis.process.env && globalThis.process.env[key]) {
    return globalThis.process.env[key];
  }
  if (typeof window !== "undefined") {
    if (key === "VITE_AUTH_API_URL") {
      return (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_AUTH_API_URL) || "/evaluation-service/auth";
    }
    if (key === "VITE_LOG_API_URL") {
      return (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_LOG_API_URL) || "/evaluation-service/logs";
    }
    if (key === "VITE_NOTIFICATIONS_API_URL") {
      return (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_NOTIFICATIONS_API_URL) || "/evaluation-service/notifications";
    }
  }
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  if (typeof window !== "undefined" && fallback && typeof fallback === "string" && fallback.startsWith("http://4.224.186.213/evaluation-service/")) {
    return fallback.replace("http://4.224.186.213", "");
  }
  return fallback;
};

const NOTIFICATIONS_API_URL = getEnv("VITE_NOTIFICATIONS_API_URL", "http://4.224.186.213/evaluation-service/notifications");

export async function fetchNotifications(page, limit, notificationType) {
  await Log("frontend", "info", "api", "Notification fetch started");
  try {
    const token = await getAuthToken();
    let url = NOTIFICATIONS_API_URL;
    const params = [];
    if (page !== undefined) {
      params.push(`page=${page}`);
    }
    if (limit !== undefined) {
      params.push(`limit=${limit}`);
    }
    if (notificationType && notificationType !== "All") {
      params.push(`notification_type=${notificationType}`);
    }
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      const errorMsg = `HTTP error ${response.status}: ${errText}`;
      await Log("frontend", "error", "api", `Notification fetch failed: ${errorMsg}`);
      throw new Error(errorMsg);
    }

    const data = await response.json();
    const list = data.notifications || [];
    await Log("frontend", "info", "api", `Notification fetch completed successfully: fetched ${list.length} items`);
    return list;
  } catch (error) {
    await Log("frontend", "error", "api", `Notification fetch failed: ${error.message}`);
    throw error;
  }
}

export async function getTopPriorityNotifications(n = 10) {
  try {
    const list = await fetchNotifications();

    await Log("frontend", "info", "api", "Priority calculation started");

    const placements = [];
    const results = [];
    const events = [];
    const other = [];

    for (const item of list) {
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

    const sorted = [...placements, ...results, ...events, ...other];
    const topN = sorted.slice(0, n);

    await Log("frontend", "info", "api", `Priority calculation completed: selected top ${topN.length} of ${list.length} notifications`);
    return topN;
  } catch (error) {
    await Log("frontend", "error", "api", `Unexpected error during priority calculation: ${error.message}`);
    throw error;
  }
}
