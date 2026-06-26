const STACKS = ["backend", "frontend"];
const LEVELS = ["debug", "info", "warn", "error", "fatal"];
const BACKEND_PACKAGES = [
  "cache",
  "controller",
  "cron_job",
  "db",
  "domain",
  "handler",
  "repository",
  "route",
  "service"
];
const FRONTEND_PACKAGES = [
  "api",
  "component",
  "hook",
  "page",
  "state",
  "style"
];
const SHARED_PACKAGES = ["auth", "config", "middleware", "utils"];

let cachedToken = null;
let tokenExpiry = 0;

const config = {
  authUrl: "http://4.224.186.213/evaluation-service/auth",
  logUrl: "http://4.224.186.213/evaluation-service/logs",
  credentials: {
    email: "csds23095@glbitm.ac.in",
    name: "kunal sati",
    rollNo: "2301921540100",
    accessCode: "xxkJnk",
    clientID: "67509f2b-b967-4269-8d16-7f2083fdf087",
    clientSecret: "hnFYNkgadqXjpnGN"
  }
};

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

export async function getAuthToken() {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && tokenExpiry > now + 60) {
    return cachedToken;
  }

  const authUrl = getEnv("VITE_AUTH_API_URL", config.authUrl);
  const payload = {
    email: getEnv("VITE_CLIENT_EMAIL", config.credentials.email),
    name: getEnv("VITE_CLIENT_NAME", config.credentials.name),
    rollNo: getEnv("VITE_CLIENT_ROLL_NO", config.credentials.rollNo),
    accessCode: getEnv("VITE_CLIENT_ACCESS_CODE", config.credentials.accessCode),
    clientID: getEnv("VITE_CLIENT_ID", config.credentials.clientID),
    clientSecret: getEnv("VITE_CLIENT_SECRET", config.credentials.clientSecret)
  };

  const response = await fetch(authUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Auth failed with status ${response.status}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiry = data.expires_in || (now + 3600);
  return cachedToken;
}

export async function Log(stack, level, packageName, message) {
  if (!STACKS.includes(stack)) {
    return { success: false, error: `Invalid stack: ${stack}` };
  }

  if (!LEVELS.includes(level)) {
    return { success: false, error: `Invalid level: ${level}` };
  }

  const allowedPackages = [
    ...SHARED_PACKAGES,
    ...(stack === "backend" ? BACKEND_PACKAGES : FRONTEND_PACKAGES)
  ];

  if (!allowedPackages.includes(packageName)) {
    return { success: false, error: `Invalid package for ${stack}: ${packageName}` };
  }

  try {
    const token = await getAuthToken();
    const logUrl = getEnv("VITE_LOG_API_URL", config.logUrl);

    const response = await fetch(logUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        stack,
        level,
        package: packageName,
        message
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return { success: false, error: `Log service error ${response.status}: ${errText}` };
    }

    const data = await response.json();
    return { success: true, logID: data.logID };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
