# AssetFlow — Enterprise Asset & Resource Management System

<div align="center">

![AssetFlow](frontend/public/logo_horizontal.png)

**A full-stack ERP platform for digitizing end-to-end asset and resource lifecycle management.**

[![Java](https://img.shields.io/badge/Java-17+-orange?logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?logo=spring)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-purple?logo=vite)](https://vitejs.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-blue?logo=mysql)](https://www.mysql.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version | Notes |
|:---|:---|:---|
| **Java JDK** | 17 or higher | Required to run the Spring Boot backend |
| **Maven** | 3.8+ | Bundled as `./mvnw` wrapper — no install needed |
| **Node.js** | 18 or higher | Required for the React frontend |
| **npm** | 9 or higher | Comes with Node.js |
| **MySQL** | 8.x | OR use the pre-configured cloud database (no setup needed!) |

---

## 🗄️ Database Setup

### Option A — Use the Pre-configured Cloud Database (Recommended)
> ✅ **Zero setup.** The project ships with a Railway MySQL cloud database pre-configured. Just run the backend and it connects automatically.

The connection details are already set in `Backend/project/src/main/resources/application.properties`. No changes needed.

### Option B — Use a Local MySQL Database

1. Create a database in your local MySQL server:
```sql
CREATE DATABASE assetflow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Update `Backend/project/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/assetflow_db
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

3. The schema will be created automatically when the Spring Boot app first boots (`spring.jpa.hibernate.ddl-auto=update`).

---

## ⚙️ Running the Application

### Step 1 — Start the Backend API Server

```bash
cd Backend/project
./mvnw spring-boot:run
```

> ✅ Server starts at **`http://localhost:8081`**
> 
> 📖 Swagger UI (API Docs) available at: **`http://localhost:8081/swagger-ui/index.html`**

The backend will:
- Connect to the MySQL database
- Auto-create all tables (if they don't exist)
- Seed demo users and sample data on first boot
- Expose a secure JWT-authenticated REST API at `/api/v1/`

---

### Step 2 — Start the Frontend Dev Server

```bash
cd frontend
npm install
npm run dev
```

> ✅ App opens at **`http://localhost:5173`**

The Vite development server includes a proxy that routes all `/api` requests to the backend at port `8081`, eliminating any CORS issues.

---

## 🔑 Demo Login Credentials

Use these pre-seeded accounts to explore each permission level:

| Role | Email | Password | Access Level |
|:---|:---|:---|:---|
| **ADMIN** | `admin@assetflow.com` | `admin123` | Full system control — org setup, role management, audit cycles |
| **ASSET MANAGER** | `manager@assetflow.com` | `manager123` | Asset registration, direct allocation, maintenance approvals |
| **DEPARTMENT HEAD** | `head@assetflow.com` | `head123` | Transfer request reviews, department oversight |
| **EMPLOYEE** | `employee@assetflow.com` | `employee123` | Shared resource booking, personal notifications |

---

## 🏗️ Project Architecture

```
AssetAndResourceManagement/
├── Backend/
│   └── project/
│       ├── src/main/java/com/application/project/
│       │   ├── controller/        # REST API Controllers (one per domain)
│       │   ├── service/           # Business logic layer
│       │   ├── repository/        # Spring Data JPA repositories
│       │   ├── entity/            # JPA entity models
│       │   ├── dto/               # Request/Response DTOs
│       │   ├── security/          # JWT authentication filter & config
│       │   └── config/            # Spring Security & app configuration
│       └── src/main/resources/
│           └── application.properties  # DB + JWT config
│
└── frontend/
    ├── public/
    │   └── logo_horizontal.png    # App logo
    ├── src/
    │   ├── components/            # One file per module screen
    │   │   ├── LoginScreen.jsx
    │   │   ├── DashboardScreen.jsx
    │   │   ├── OrgSetupScreen.jsx
    │   │   ├── AssetsScreen.jsx
    │   │   ├── AllocationScreen.jsx
    │   │   ├── BookingScreen.jsx
    │   │   ├── MaintenanceScreen.jsx
    │   │   ├── AuditScreen.jsx
    │   │   ├── ReportsScreen.jsx
    │   │   └── ActivityLogsScreen.jsx
    │   ├── services/
    │   │   └── api.js             # Centralized Axios API client
    │   ├── App.jsx                # Router, layout & global state
    │   └── main.jsx
    ├── vite.config.js             # Dev proxy config (5173 → 8081)
    └── package.json
```

---

## 🌐 API Overview

Base URL: `http://localhost:8081/api/v1`

All protected endpoints require: `Authorization: Bearer <JWT_TOKEN>`

| Domain | Endpoints |
|:---|:---|
| **Auth** | `POST /auth/login`, `POST /auth/signup` |
| **Dashboard** | `GET /dashboard/summary` |
| **Assets** | `GET/POST /assets`, `GET /assets/{id}/history` |
| **Allocations** | `GET/POST /allocations`, `POST /allocations/{id}/return` |
| **Transfers** | `GET/POST /transfers`, `PATCH /transfers/{id}/approve`, `/reject` |
| **Bookings** | `GET/POST /bookings`, `PATCH /bookings/{id}/cancel` |
| **Maintenance** | `GET/POST /maintenance-requests`, `PATCH /…/approve`, `/reject`, `/start`, `/resolve`, `/assign` |
| **Audit Cycles** | `GET/POST /audit-cycles`, `PATCH /audit-cycles/{id}/close`, `POST /{id}/assignments` |
| **Departments** | `GET/POST /departments`, `PATCH /departments/{id}/deactivate` |
| **Categories** | `GET/POST /categories` |
| **Users** | `GET /users`, `PATCH /users/{id}/role` |
| **Notifications** | `GET /notifications`, `PATCH /notifications/{id}/read` |
| **Activity Logs** | `GET /activity-logs` |

---

## 📱 Module Walkthroughs

### 1. Login / Signup
- JWT-based authentication with role-based session management
- Automatic redirect to dashboard after login
- Signup creates standard employee accounts; Admins promote roles

### 2. Dashboard
- Live KPI cards: Available, Allocated, Under Maintenance, Active Bookings, Pending Transfers, Overdue Returns
- Overdue return alert banner
- Recent activity feed from system logs

### 3. Organization Setup *(Admin Only)*
- **Departments Tab**: Create hierarchy with parent department & department head assignment. Deactivate departments.
- **Categories Tab**: Manage asset category taxonomy
- **Employee Directory Tab**: View all users, promote/change roles

### 4. Asset Registry
- Register new assets with auto-generated Asset Tag (`AF-0001`, etc.)
- Full-text search, filter by category & lifecycle status
- Click any asset to view its complete lifecycle event timeline

### 5. Allocation & Transfer
- Direct allocation of AVAILABLE assets to employees with return date
- If asset is ALLOCATED → auto-converts to Transfer Request form
- Transfer approval/rejection workflow for managers & heads
- Return check-in modal to restore asset to AVAILABLE

### 6. Resource Booking
- Calendar-style booking for assets marked `isBookable: true`
- Overlap prevention enforced on backend (HTTP 409)
- Cancel active bookings to free up slots

### 7. Maintenance Kanban
- Kanban board with columns: Pending → Approved → Technician Assigned → In Progress → Resolved
- Approve/Reject tickets (Admin/Asset Manager)
- Assign technicians from employee directory
- Resolve with notes — auto-returns asset to AVAILABLE

### 8. Audit
- Create named audit cycles with date ranges
- Assign specific assets to auditors in a checklist
- Record findings: Verified / Missing / Damaged
- Close cycle to lock results and auto-update asset states

### 9. Reports & Analytics
- Live inventory ratio bar charts (Allocated / Available / Under Maintenance)
- Idle assets list and maintenance assets list
- Export analytics report trigger

### 10. Notifications
- Real-time notifications from all system events
- Filter: All / Unread / Alerts / Approvals / Bookings
- Mark individual notifications as read

---

## 🔐 Security

- **JWT Authentication**: `HS384` signed tokens with 24-hour expiry
- **Role-Based Access Control**: `ADMIN`, `ASSET_MANAGER`, `DEPARTMENT_HEAD`, `EMPLOYEE`
- **Spring Security**: Stateless filter chain with CORS configured
- **Password Hashing**: BCrypt (strength 10)
- **Token Storage**: Browser `localStorage` with automatic header injection via Axios interceptor

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|:---|:---|:---|
| Java | 17 | Core language |
| Spring Boot | 3.x | Application framework |
| Spring Security | 6.x | Authentication & authorization |
| Spring Data JPA | 3.x | ORM / database layer |
| Hibernate | 6.x | JPA implementation |
| MySQL Connector | 8.x | Database driver |
| JWT (jjwt) | 0.12.x | Token generation & validation |
| Lombok | 1.18 | Boilerplate reduction |
| SpringDoc OpenAPI | 2.x | Swagger UI generation |
| Maven | 3.8+ | Build & dependency management |

### Frontend
| Technology | Version | Purpose |
|:---|:---|:---|
| React | 18 | UI framework |
| Vite | 7 | Build tool & dev server |
| React Router | 6 | Client-side routing |
| Axios | 1.x | HTTP client |
| TailwindCSS | 3.x | Utility-first CSS |
| Material Symbols | — | Google icon font |

---

## 🗺️ Asset Lifecycle State Machine

```
                  ┌─────────────┐
                  │  AVAILABLE  │◄──────────────────────────┐
                  └──────┬──────┘                           │
                         │                                   │
          ┌──────────────┼──────────────┐                   │
          ▼              ▼              ▼                    │
     ┌─────────┐  ┌──────────┐  ┌──────────────────┐       │
     │ALLOCATED│  │ RESERVED │  │UNDER_MAINTENANCE  │       │
     └────┬────┘  └────┬─────┘  └────────┬─────────┘       │
          │            │                  │                   │
          │ Return      │ Release          │ Resolve          │
          └────────────┴──────────────────┴──────────────────┘
          │
          ▼ (Audit: Missing)
       ┌──────┐
       │ LOST │──► DISPOSED
       └──────┘
```

---

## 📊 Entity Relationship Summary

| Entity | Key Relationships |
|:---|:---|
| `User` | Belongs to Department, has Role |
| `Asset` | Belongs to Category, has LifecycleState |
| `Allocation` | Asset ↔ User (assignee), has return date |
| `TransferRequest` | Asset, From User, To User, Status |
| `Booking` | Bookable Asset, User, time range |
| `MaintenanceRequest` | Asset, Reporter, Technician, Priority |
| `AuditCycle` | Has many AuditAssignments (Asset + Auditor + Finding) |
| `Notification` | Belongs to User, has type and isRead flag |
| `ActivityLog` | Asset history events with state transitions |

---

## 📝 License

This project was built for the **Odoo Hackathon 2026**. All rights reserved.
