# Campus Notifications Hub

A campus notifications system built with Node.js and React (Material UI). The system retrieves notification streams, prioritizes them based on a category-weight sorting algorithm, and renders a fully responsive dashboard with theme customizations, status tracking, and logging middleware integration.

## Stage 1: Priority Notification Processing
- Implemented a prioritizer script (`get-top-10.js`) that queries the Campus Notifications API.
- Categories are ranked by priority: `Placement` > `Result` > `Event` > `Other`.
- Notifications within the same category are sorted dynamically by timestamp (most recent first).
- Executing the script generates a clean tabular representation in `output.html`.
- The reference output screenshot is saved at `stage-1-output.png`.

## Stage 2: React Dashboard & Priority Inbox UI
- Developed a professional frontend using React 19, Vite, and Material UI.
- Features:
  - **Shared State Navigation:** Tab selection, unread badge counts, and cache updates are lifting-state synced between pages and navigation bars.
  - **Tabular Feeds:** Displays dense categorized rows showing notification metadata, type chips, and contextual action menus.
  - **Priority Inbox:** An inbox applying the Stage 1 sorting algorithm with custom item limit selectors (Top 10, 15, 20) and illustration clear-states.
  - **Theme Toggle:** Supports Light and Dark mode switches.
  - **Logging Middleware:** Integrated custom logging middleware to record events and trace analytics.
- Visual demonstration recording is saved in the workspace root at `stage-2-demo.webp`.

## Running the Project

### 1. Priority CLI Script (Stage 1)
To run the prioritization script and generate `output.html`:
```bash
node get-top-10.js
```

### 2. Frontend Application (Stage 2)
To run the React dashboard:
```bash
# Go to frontend directory
cd notification-app-fe

# Run production build
npm run build

# Start development server
npm run dev
```
