# NotificationRateLimiterFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.1.

## Development server

To start a local development server, run:

```bash
ng serve --open
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

# Notification Rate Limiter Frontend

A lightweight Angular application for managing and testing per-client notification rate limits.  
It provides two interfaces:

**Admin Panel** – Create, update, and delete client rate-limit configurations.  
**User Simulator** – Send test notification requests and observe how limits behave in real time.

This project is intended as a companion to a backend rate-limiting service running at `http://localhost:8081`.

---

## Features

### Admin Panel
- Add/update notification limits for any `clientId`.
- Configure:
  - Monthly limit
  - Sliding-window capacity
  - Sliding-window duration (seconds)
- View and delete existing limits.

### User Simulator
- Load rate-limit settings for a given client.
- Send N notification requests sequentially.
- Display:
  - Backend response message
  - Remaining quota (`X-Rate-Limit-Remaining` header)
  - Any rate-limit or server errors

---

## Requirements

- Node.js **18+**
- Angular CLI **17+**
- Backend API running at **http://localhost:8081**

The backend must expose these endpoints:

GET /admin/limits
POST /admin/limits
DELETE /admin/limits/{clientId}
GET /admin/limits/{clientId}
GET /api/notifications/send (requires header: X-Client-ID)

Running the Application

Start the Angular dev server:

```bash
ng serve
````

Open the app:

```bash
http://localhost:4200
```

Ensure the backend is already running on:

```bash
http://localhost:8081
```


## Project Structure Overview
/src/app/admin/admin.component.ts

  - Angular Material form for limit management
  
  - Displays all configured limits
  
  - Supports add/update/delete actions
  
  - Uses ApiService for backend calls

/src/app/user/user.component.ts

  - Loads limits for a specified clientId

  - Sends a sequence of notification requests

  - Shows detailed per-request results

  - Stops automatically when a rate-limit error occurs

/src/app/services/api.service.ts

  - Wraps all communication with the backend

  - Extracts rate-limit metadata from headers

  - Provides functions for:

     - CRUD operations on limits

     - Sending notification test requests

Notes

- Uses Angular standalone components (no NgModules).

- Styled with Angular Material.

- Uses Observables for HTTP, optionally convertible to Promises with firstValueFrom.

- UI assumes the backend sends correct rate-limit headers.





## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
