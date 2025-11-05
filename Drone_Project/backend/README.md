# Drone API Server - Backend

A RESTful API for managing drone data and logging operational status. This service connects to external Config and Log Servers using environment variables.

---

## Features

- `GET /configs/:droneId` — Retrieve drone configuration from `CONFIG_SERVER_URL`
- `GET /status/:droneId` — Check the current status of a drone
- `GET /logs/:droneId` — Fetch recent logs for a drone from `LOG_SERVER_URL`
- `POST /logs` — Submit a new log entry for a drone

---

## Tech Stack

- Node.js with Express
- Axios for external API requests
- dotenv for managing environment variables

---

## Environment Variables

Create a `.env` file in the root directory with the following values:

```env
CONFIG_SERVER_URL=https://your-config-source.com
LOG_SERVER_URL=https://your-log-server.com/api/collections/drone_logs/records
LOG_API_TOKEN=your-log-api-token
```

---

## Account Testing
```
USERNAME=admin
PASSWORD=123456
```
---