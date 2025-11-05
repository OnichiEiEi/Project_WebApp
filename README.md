# Drone WebApp Project

This repository contains a full-stack web application for managing drone data and operations. The system is divided into two main components:

- **Frontend**: A user interface for interacting with drone information.
- **Backend**: An Express.js API that handles configuration retrieval, status monitoring, and logging.
  
---

## Backend Features

- `GET /configs/:droneId`  
  Retrieves configuration data for a specific drone from an external source.

- `GET /status/:droneId`  
  Returns the current operational status of a drone.

- `GET /logs/:droneId`  
  Fetches paginated log entries for a drone.

- `POST /logs`  
  Submits a new log entry to the logging server.

- Implements rate limiting, retry logic, and caching for performance and reliability.

---

## Frontend Overview

The frontend provides a responsive interface for users to:

- Search and view drone configurations
- Monitor drone status
- Review historical logs
- Interact with backend APIs

---

### Clone the repository

```bash
git clone https://github.com/OnichiEiEi/Project_WebApp.git
```
