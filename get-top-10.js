import { getTopPriorityNotifications } from "./notification-app-fe/src/api/notifications.js";
import fs from "fs";

async function generateOutput() {
  try {
    const list = await getTopPriorityNotifications(10);
    
    console.log("================================================================================");
    console.log("                     TOP 10 PRIORITY NOTIFICATIONS                             ");
    console.log("================================================================================");
    console.table(
      list.map(n => ({
        ID: n.ID,
        Type: n.Type,
        Message: n.Message,
        Timestamp: n.Timestamp
      }))
    );
    console.log("================================================================================");

    const rowsHtml = list
      .map(
        (n, i) => `
      <tr>
        <td class="rank">${i + 1}</td>
        <td><span class="badge badge-${n.Type.toLowerCase()}">${n.Type}</span></td>
        <td class="msg">${n.Message}</td>
        <td class="time">${n.Timestamp}</td>
      </tr>
    `
      )
      .join("");

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Top 10 Priority Notifications</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      padding: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .card {
      background: #1e293b;
      border-radius: 16px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
      width: 100%;
      max-width: 900px;
      padding: 32px;
      border: 1px solid #334155;
    }
    h2 {
      margin-top: 0;
      margin-bottom: 24px;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.025em;
      background: linear-gradient(to right, #38bdf8, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    th {
      padding: 12px 16px;
      color: #94a3b8;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid #334155;
    }
    td {
      padding: 16px;
      border-bottom: 1px solid #334155;
      font-size: 14px;
    }
    tr:last-child td {
      border-bottom: none;
    }
    .rank {
      font-weight: 600;
      color: #64748b;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }
    .badge-placement {
      background: rgba(14, 165, 233, 0.15);
      color: #38bdf8;
      border: 1px solid rgba(14, 165, 233, 0.3);
    }
    .badge-result {
      background: rgba(168, 85, 247, 0.15);
      color: #c084fc;
      border: 1px solid rgba(168, 85, 247, 0.3);
    }
    .badge-event {
      background: rgba(234, 179, 8, 0.15);
      color: #facc15;
      border: 1px solid rgba(234, 179, 8, 0.3);
    }
    .msg {
      font-weight: 500;
      color: #e2e8f0;
    }
    .time {
      color: #64748b;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <div class="card">
    <h2>Priority Inbox &mdash; Top 10 Notifications</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 60px;">Rank</th>
          <th style="width: 140px;">Type</th>
          <th>Message</th>
          <th style="width: 180px;">Timestamp</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
  </div>
</body>
</html>`;

    fs.writeFileSync("output.html", htmlContent);
  } catch (error) {
    console.error(error);
  }
}

generateOutput();
