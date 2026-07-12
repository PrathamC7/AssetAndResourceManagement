# Design Document: AssetFlow

## Overview

AssetFlow is an enterprise asset and resource management system designed for rapid delivery in an 8-hour solo hackathon window. The architecture prioritizes a complete MySQL schema foundation covering all 10 modules, with a Spring Boot REST API layer and React + Material UI frontend. The design focuses on simplicity, clear separation of concerns, and practical implementation order.

## Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React SPA)                   │
│  React 18 + TypeScript + Material UI + React Router v6       │
│  Axios (HTTP client) + JWT in localStorage                   │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTPS / JSON
                          │ Authorization: Bearer <JWT>
┌─────────────────────────▼───────────────────────────────────┐
│                   Backend (Spring Boot 3.x)                   │
│  Spring Security + JWT Filter → Controllers → Services → JPA │
│  /api/v1/*                                                   │
└─────────────────────────┬───────────────────────────────────┘
                          │ JDBC (HikariCP)
┌─────────────────────────▼───────────────────────────────────┐
│                      MySQL 8.x (InnoDB)                       │
│  14 tables, utf8mb4, foreign keys, indexes                   │
└─────────────────────────────────────────────────────────────┘
```

### Component Diagram

```
Frontend Modules:
├── Auth (Login, Signup, JWT management)
├── Dashboard (KPI cards, quick actions)
├── Organization Setup (Departments, Categories, Employee Directory)
├── Asset Management (Registration, Directory, Detail, Lifecycle)
├── Allocation & Transfer (Allocate, Return, Transfer workflow)
├── Resource Booking (Calendar view, booking form)
├── Maintenance (Request form, status tracking)
└── Shared (Layout, Sidebar, ProtectedRoute, API client)

Backend Modules:
├── config/ (SecurityConfig, JwtFilter, CorsConfig)
├── controller/ (AuthController, DashboardController, DepartmentController,
│                CategoryController, UserController, AssetController,
│                AllocationController, TransferController, BookingController,
│                MaintenanceController)
├── service/ (business logic for each domain)
├── repository/ (JPA repositories)
├── model/ (JPA entities)
├── dto/ (request/response DTOs)
├── enums/ (Role, LifecycleState, BookingStatus, etc.)
└── exception/ (GlobalExceptionHandler, custom exceptions)
```

## Components and Interfaces

### Data Flow Diagrams

#### Authentication Flow

```
User → [Signup/Login Form] → POST /api/v1/auth/signup or /login
  → AuthController → AuthService → UserRepository → MySQL
  ← JWT token (contains userId, email, role)
  → Frontend stores JWT in localStorage
  → All subsequent requests include: Authorization: Bearer <token>
  → JwtAuthFilter validates token on every request
```

#### Asset Allocation Flow

```
Asset_Manager → [Allocation Form] → POST /api/v1/allocations
  → AllocationController → AllocationService
    → Validates asset is Available
    → Validates return date is future
    → Creates Allocation record
    → Updates Asset lifecycle_state → Allocated
    → Creates AssetHistory entry
  ← 201 Created { allocation data }
```

#### Resource Booking Flow

```
User → [Booking Form] → POST /api/v1/bookings
  → BookingController → BookingService
    → Validates asset is bookable
    → Checks for time overlap with existing bookings
    → Creates ResourceBooking record (status: Upcoming)
  ← 201 Created { booking data }
```

#### Maintenance Request Flow

```
User → [Maintenance Form] → POST /api/v1/maintenance-requests
  → MaintenanceController → MaintenanceService
    → Creates MaintenanceRequest (status: Pending)
  ← 201 Created

Asset_Manager → PATCH /api/v1/maintenance-requests/{id}/approve
  → Updates request status → Approved
  → Updates asset lifecycle_state → Under Maintenance
  → Creates AssetHistory entry

Resolution → PATCH /api/v1/maintenance-requests/{id}/resolve
  → Updates status → Resolved
  → Updates asset lifecycle_state → Available
  → Creates AssetHistory entry
```

### Authentication & Security

#### JWT Token Structure

```json
{
  "sub": "user@example.com",
  "userId": 1,
  "role": "ADMIN",
  "iat": 1720000000,
  "exp": 1720086400
}
```

#### JwtAuthFilter (Spring Security)

```java
@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response, FilterChain chain) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            Claims claims = jwtUtil.parseToken(token);
            UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                    claims.getSubject(), null,
                    List.of(new SimpleGrantedAuthority("ROLE_" + claims.get("role"))));
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        chain.doFilter(request, response);
    }
}
```

#### Role Hierarchy

```
Admin > Asset_Manager > Department_Head > Employee
```

Each role inherits all permissions of lower roles. Enforced via `@PreAuthorize`:

```java
@PreAuthorize("hasAnyRole('ADMIN', 'ASSET_MANAGER')")
@PostMapping("/api/v1/assets")
public ResponseEntity<ApiResponse<AssetResponse>> registerAsset(...) { }
```

### API Response Envelope

All REST endpoints return a consistent envelope:

```java
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp;

    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, message, data, LocalDateTime.now());
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null, LocalDateTime.now());
    }
}
```

Paginated responses use:

```java
public class PagedResponse<T> {
    private boolean success;
    private String message;
    private List<T> data;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private LocalDateTime timestamp;
}
```

## Data Models

### Entity Relationship Diagram

```
┌──────────┐       ┌─────────────┐       ┌────────────────────┐
│  users   │1────M│ allocations  │M────1│      assets         │
│          │       │              │       │                    │
│          │1────M│  transfers   │M────1│                    │
│          │       └─────────────┘       │                    │
│          │                              │                    │
│          │1────M┌──────────────────┐M──1│                    │
│          │      │resource_bookings │    │                    │
│          │      └──────────────────┘    │                    │
│          │                              │                    │
│          │1────M┌─────────────────────┐M─1                  │
│          │      │maintenance_requests │  │                    │
│          │      └─────────────────────┘  │                    │
│          │                              │                    │
│          │1────M┌───────────────┐       │                    │
│          │      │ asset_history │M────1│                    │
│          │      └───────────────┘       │                    │
│          │                              └────────────────────┘
│          │                                       │1
│          │1────M┌──────────────────┐             │
│          │      │ activity_logs    │             M
│          │      └──────────────────┘    ┌────────────────┐
│          │                              │asset_categories│
│          │1────M┌───────────────┐       └────────┬───────┘
│          │      │ notifications │              1│
│          │      └───────────────┘               M
│          │                              ┌────────────────────────┐
│          │M────1┌─────────────┐         │category_custom_fields  │
│          │      │ departments │         └────────────────────────┘
│          │      └──────┬──────┘
└──────────┘          1│
                        M (self-referencing: parent_id)

┌──────────────┐       ┌───────────────────┐
│ audit_cycles │1────M│ audit_assignments │M────1 assets
└──────────────┘       └───────────────────┘M────1 users
```

### Relationship Summary

| Relationship | Type | FK Location |
|---|---|---|
| users → departments | M:1 | users.department_id |
| departments → departments (parent) | M:1 (self) | departments.parent_id |
| departments → users (head) | M:1 | departments.head_id |
| assets → asset_categories | M:1 | assets.category_id |
| asset_categories → category_custom_fields | 1:M | category_custom_fields.category_id |
| allocations → assets | M:1 | allocations.asset_id |
| allocations → users (assignee) | M:1 | allocations.assigned_to |
| allocations → users (allocated_by) | M:1 | allocations.allocated_by |
| transfers → assets | M:1 | transfers.asset_id |
| transfers → users (from/to/approved_by) | M:1 | transfers.from_user_id, to_user_id, approved_by |
| resource_bookings → assets | M:1 | resource_bookings.asset_id |
| resource_bookings → users | M:1 | resource_bookings.booked_by |
| maintenance_requests → assets | M:1 | maintenance_requests.asset_id |
| maintenance_requests → users (requester/assignee) | M:1 | maintenance_requests.requested_by, assigned_to |
| asset_history → assets | M:1 | asset_history.asset_id |
| asset_history → users | M:1 | asset_history.performed_by |
| audit_cycles → users (created_by) | M:1 | audit_cycles.created_by |
| audit_assignments → audit_cycles | M:1 | audit_assignments.cycle_id |
| audit_assignments → assets | M:1 | audit_assignments.asset_id |
| audit_assignments → users (auditor) | M:1 | audit_assignments.auditor_id |
| notifications → users | M:1 | notifications.user_id |
| activity_logs → users | M:1 | activity_logs.user_id |

### MySQL DDL — Complete Schema

```sql
-- =============================================================
-- AssetFlow Database Schema — MySQL 8.x (InnoDB, utf8mb4)
-- =============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------
-- 1. users
-- -----------------------------------------------------------
CREATE TABLE `users` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('ADMIN','ASSET_MANAGER','DEPARTMENT_HEAD','EMPLOYEE') NOT NULL DEFAULT 'EMPLOYEE',
  `department_id` BIGINT DEFAULT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_email` (`email`),
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_department` (`department_id`),
  INDEX `idx_users_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

```sql
-- -----------------------------------------------------------
-- 2. departments
-- -----------------------------------------------------------
CREATE TABLE `departments` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `parent_id` BIGINT DEFAULT NULL,
  `head_id` BIGINT DEFAULT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_departments_name` (`name`),
  INDEX `idx_departments_parent` (`parent_id`),
  INDEX `idx_departments_head` (`head_id`),
  INDEX `idx_departments_active` (`is_active`),
  CONSTRAINT `fk_departments_parent` FOREIGN KEY (`parent_id`)
    REFERENCES `departments`(`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_departments_head` FOREIGN KEY (`head_id`)
    REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add FK from users to departments (deferred due to circular reference)
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_department` FOREIGN KEY (`department_id`)
    REFERENCES `departments`(`id`) ON DELETE SET NULL;
```

```sql
-- -----------------------------------------------------------
-- 3. asset_categories
-- -----------------------------------------------------------
CREATE TABLE `asset_categories` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_categories_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

```sql
-- -----------------------------------------------------------
-- 4. category_custom_fields
-- -----------------------------------------------------------
CREATE TABLE `category_custom_fields` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `category_id` BIGINT NOT NULL,
  `field_name` VARCHAR(100) NOT NULL,
  `field_type` ENUM('TEXT','NUMBER','DATE','BOOLEAN','SELECT') NOT NULL,
  `is_required` BOOLEAN NOT NULL DEFAULT FALSE,
  `options` JSON DEFAULT NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_custom_fields_category_name` (`category_id`, `field_name`),
  INDEX `idx_custom_fields_category` (`category_id`),
  CONSTRAINT `fk_custom_fields_category` FOREIGN KEY (`category_id`)
    REFERENCES `asset_categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

```sql
-- -----------------------------------------------------------
-- 5. assets
-- -----------------------------------------------------------
CREATE TABLE `assets` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `asset_tag` VARCHAR(10) NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `category_id` BIGINT NOT NULL,
  `serial_number` VARCHAR(100) NOT NULL,
  `acquisition_date` DATE NOT NULL,
  `cost` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `condition_status` VARCHAR(50) NOT NULL DEFAULT 'Good',
  `location` VARCHAR(200) DEFAULT NULL,
  `photo_url` VARCHAR(500) DEFAULT NULL,
  `is_bookable` BOOLEAN NOT NULL DEFAULT FALSE,
  `lifecycle_state` ENUM('AVAILABLE','ALLOCATED','RESERVED',
    'UNDER_MAINTENANCE','LOST','RETIRED','DISPOSED') NOT NULL DEFAULT 'AVAILABLE',
  `custom_fields` JSON DEFAULT NULL,
  `registered_by` BIGINT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_assets_tag` (`asset_tag`),
  UNIQUE KEY `uk_assets_serial` (`serial_number`),
  INDEX `idx_assets_category` (`category_id`),
  INDEX `idx_assets_state` (`lifecycle_state`),
  INDEX `idx_assets_bookable` (`is_bookable`),
  INDEX `idx_assets_location` (`location`),
  INDEX `idx_assets_registered_by` (`registered_by`),
  CONSTRAINT `fk_assets_category` FOREIGN KEY (`category_id`)
    REFERENCES `asset_categories`(`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_assets_registered_by` FOREIGN KEY (`registered_by`)
    REFERENCES `users`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

```sql
-- -----------------------------------------------------------
-- 6. asset_history
-- -----------------------------------------------------------
CREATE TABLE `asset_history` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `asset_id` BIGINT NOT NULL,
  `event_type` ENUM('STATE_CHANGE','ALLOCATION','RETURN',
    'TRANSFER','MAINTENANCE','REGISTRATION') NOT NULL,
  `previous_state` ENUM('AVAILABLE','ALLOCATED','RESERVED',
    'UNDER_MAINTENANCE','LOST','RETIRED','DISPOSED') DEFAULT NULL,
  `new_state` ENUM('AVAILABLE','ALLOCATED','RESERVED',
    'UNDER_MAINTENANCE','LOST','RETIRED','DISPOSED') DEFAULT NULL,
  `description` TEXT NOT NULL,
  `performed_by` BIGINT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_history_asset` (`asset_id`),
  INDEX `idx_history_event_type` (`event_type`),
  INDEX `idx_history_performed_by` (`performed_by`),
  INDEX `idx_history_created_at` (`created_at` DESC),
  CONSTRAINT `fk_history_asset` FOREIGN KEY (`asset_id`)
    REFERENCES `assets`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_history_user` FOREIGN KEY (`performed_by`)
    REFERENCES `users`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

```sql
-- -----------------------------------------------------------
-- 7. allocations
-- -----------------------------------------------------------
CREATE TABLE `allocations` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `asset_id` BIGINT NOT NULL,
  `assigned_to` BIGINT NOT NULL,
  `allocated_by` BIGINT NOT NULL,
  `expected_return_date` DATE DEFAULT NULL,
  `actual_return_date` DATETIME DEFAULT NULL,
  `condition_notes` TEXT DEFAULT NULL,
  `is_overdue` BOOLEAN NOT NULL DEFAULT FALSE,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_allocations_asset` (`asset_id`),
  INDEX `idx_allocations_assignee` (`assigned_to`),
  INDEX `idx_allocations_active` (`is_active`),
  INDEX `idx_allocations_overdue` (`is_overdue`),
  INDEX `idx_allocations_return_date` (`expected_return_date`),
  INDEX `idx_allocations_allocated_by` (`allocated_by`),
  CONSTRAINT `fk_allocations_asset` FOREIGN KEY (`asset_id`)
    REFERENCES `assets`(`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_allocations_assignee` FOREIGN KEY (`assigned_to`)
    REFERENCES `users`(`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_allocations_allocator` FOREIGN KEY (`allocated_by`)
    REFERENCES `users`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

```sql
-- -----------------------------------------------------------
-- 8. transfers
-- -----------------------------------------------------------
CREATE TABLE `transfers` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `asset_id` BIGINT NOT NULL,
  `from_user_id` BIGINT NOT NULL,
  `to_user_id` BIGINT NOT NULL,
  `reason` TEXT DEFAULT NULL,
  `status` ENUM('REQUESTED','APPROVED','REJECTED') NOT NULL DEFAULT 'REQUESTED',
  `approved_by` BIGINT DEFAULT NULL,
  `approved_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_transfers_asset` (`asset_id`),
  INDEX `idx_transfers_from` (`from_user_id`),
  INDEX `idx_transfers_to` (`to_user_id`),
  INDEX `idx_transfers_status` (`status`),
  INDEX `idx_transfers_approved_by` (`approved_by`),
  CONSTRAINT `fk_transfers_asset` FOREIGN KEY (`asset_id`)
    REFERENCES `assets`(`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_transfers_from` FOREIGN KEY (`from_user_id`)
    REFERENCES `users`(`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_transfers_to` FOREIGN KEY (`to_user_id`)
    REFERENCES `users`(`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_transfers_approved_by` FOREIGN KEY (`approved_by`)
    REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

```sql
-- -----------------------------------------------------------
-- 9. resource_bookings
-- -----------------------------------------------------------
CREATE TABLE `resource_bookings` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `asset_id` BIGINT NOT NULL,
  `booked_by` BIGINT NOT NULL,
  `title` VARCHAR(200) DEFAULT NULL,
  `start_time` DATETIME NOT NULL,
  `end_time` DATETIME NOT NULL,
  `status` ENUM('UPCOMING','ONGOING','COMPLETED','CANCELLED') NOT NULL DEFAULT 'UPCOMING',
  `notes` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_bookings_asset` (`asset_id`),
  INDEX `idx_bookings_user` (`booked_by`),
  INDEX `idx_bookings_status` (`status`),
  INDEX `idx_bookings_time_range` (`asset_id`, `start_time`, `end_time`),
  INDEX `idx_bookings_start` (`start_time`),
  INDEX `idx_bookings_end` (`end_time`),
  CONSTRAINT `fk_bookings_asset` FOREIGN KEY (`asset_id`)
    REFERENCES `assets`(`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_bookings_user` FOREIGN KEY (`booked_by`)
    REFERENCES `users`(`id`) ON DELETE RESTRICT,
  CONSTRAINT `chk_bookings_time` CHECK (`end_time` > `start_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

```sql
-- -----------------------------------------------------------
-- 10. maintenance_requests
-- -----------------------------------------------------------
CREATE TABLE `maintenance_requests` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `asset_id` BIGINT NOT NULL,
  `requested_by` BIGINT NOT NULL,
  `issue_description` TEXT NOT NULL,
  `priority` ENUM('LOW','MEDIUM','HIGH','CRITICAL') NOT NULL DEFAULT 'MEDIUM',
  `status` ENUM('PENDING','APPROVED','REJECTED',
    'TECHNICIAN_ASSIGNED','IN_PROGRESS','RESOLVED') NOT NULL DEFAULT 'PENDING',
  `photo_url` VARCHAR(500) DEFAULT NULL,
  `assigned_to` BIGINT DEFAULT NULL,
  `resolution_notes` TEXT DEFAULT NULL,
  `resolved_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_maintenance_asset` (`asset_id`),
  INDEX `idx_maintenance_requester` (`requested_by`),
  INDEX `idx_maintenance_status` (`status`),
  INDEX `idx_maintenance_priority` (`priority`),
  INDEX `idx_maintenance_assignee` (`assigned_to`),
  CONSTRAINT `fk_maintenance_asset` FOREIGN KEY (`asset_id`)
    REFERENCES `assets`(`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_maintenance_requester` FOREIGN KEY (`requested_by`)
    REFERENCES `users`(`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_maintenance_assignee` FOREIGN KEY (`assigned_to`)
    REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

```sql
-- -----------------------------------------------------------
-- 11. audit_cycles
-- -----------------------------------------------------------
CREATE TABLE `audit_cycles` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `status` ENUM('OPEN','CLOSED') NOT NULL DEFAULT 'OPEN',
  `start_date` DATE NOT NULL,
  `end_date` DATE DEFAULT NULL,
  `created_by` BIGINT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_audit_cycles_status` (`status`),
  INDEX `idx_audit_cycles_created_by` (`created_by`),
  INDEX `idx_audit_cycles_dates` (`start_date`, `end_date`),
  CONSTRAINT `fk_audit_cycles_creator` FOREIGN KEY (`created_by`)
    REFERENCES `users`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

```sql
-- -----------------------------------------------------------
-- 12. audit_assignments
-- -----------------------------------------------------------
CREATE TABLE `audit_assignments` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `cycle_id` BIGINT NOT NULL,
  `asset_id` BIGINT NOT NULL,
  `auditor_id` BIGINT NOT NULL,
  `finding` ENUM('VERIFIED','MISSING','DAMAGED') DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `audited_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_audit_cycle_asset` (`cycle_id`, `asset_id`),
  INDEX `idx_audit_assignments_cycle` (`cycle_id`),
  INDEX `idx_audit_assignments_asset` (`asset_id`),
  INDEX `idx_audit_assignments_auditor` (`auditor_id`),
  INDEX `idx_audit_assignments_finding` (`finding`),
  CONSTRAINT `fk_audit_assignments_cycle` FOREIGN KEY (`cycle_id`)
    REFERENCES `audit_cycles`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_audit_assignments_asset` FOREIGN KEY (`asset_id`)
    REFERENCES `assets`(`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_audit_assignments_auditor` FOREIGN KEY (`auditor_id`)
    REFERENCES `users`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

```sql
-- -----------------------------------------------------------
-- 13. notifications
-- -----------------------------------------------------------
CREATE TABLE `notifications` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `reference_type` VARCHAR(50) DEFAULT NULL,
  `reference_id` BIGINT DEFAULT NULL,
  `is_read` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_notifications_user` (`user_id`),
  INDEX `idx_notifications_read` (`user_id`, `is_read`),
  INDEX `idx_notifications_type` (`type`),
  INDEX `idx_notifications_created_at` (`created_at` DESC),
  CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`)
    REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

```sql
-- -----------------------------------------------------------
-- 14. activity_logs
-- -----------------------------------------------------------
CREATE TABLE `activity_logs` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `entity_type` VARCHAR(50) NOT NULL,
  `entity_id` BIGINT NOT NULL,
  `details` JSON DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_activity_user` (`user_id`),
  INDEX `idx_activity_action` (`action`),
  INDEX `idx_activity_entity` (`entity_type`, `entity_id`),
  INDEX `idx_activity_created_at` (`created_at` DESC),
  CONSTRAINT `fk_activity_user` FOREIGN KEY (`user_id`)
    REFERENCES `users`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
```

### ENUM Reference

| ENUM Name | Values | Used In |
|---|---|---|
| Role | ADMIN, ASSET_MANAGER, DEPARTMENT_HEAD, EMPLOYEE | users.role |
| LifecycleState | AVAILABLE, ALLOCATED, RESERVED, UNDER_MAINTENANCE, LOST, RETIRED, DISPOSED | assets.lifecycle_state, asset_history |
| BookingStatus | UPCOMING, ONGOING, COMPLETED, CANCELLED | resource_bookings.status |
| MaintenanceStatus | PENDING, APPROVED, REJECTED, TECHNICIAN_ASSIGNED, IN_PROGRESS, RESOLVED | maintenance_requests.status |
| TransferStatus | REQUESTED, APPROVED, REJECTED | transfers.status |
| Priority | LOW, MEDIUM, HIGH, CRITICAL | maintenance_requests.priority |
| AuditStatus | OPEN, CLOSED | audit_cycles.status |
| AuditFinding | VERIFIED, MISSING, DAMAGED | audit_assignments.finding |
| CustomFieldType | TEXT, NUMBER, DATE, BOOLEAN, SELECT | category_custom_fields.field_type |
| HistoryEventType | STATE_CHANGE, ALLOCATION, RETURN, TRANSFER, MAINTENANCE, REGISTRATION | asset_history.event_type |

### Lifecycle State Transition Matrix

```
From \ To           | AVAILABLE | ALLOCATED | RESERVED | UNDER_MAINT | LOST | RETIRED | DISPOSED
--------------------|-----------|-----------|----------|-------------|------|---------|----------
AVAILABLE           |     -     |    ✓      |    ✓     |      ✓      |  ✓   |    ✓    |    ✓
ALLOCATED           |  ✓ (ret)  |     -     | ✓ (xfr)  |      ✓      |  ✓   |    -    |    -
RESERVED            |    ✓      |    ✓      |     -    |      -      |  -   |    -    |    -
UNDER_MAINTENANCE   |    ✓      |     -     |     -    |      -      |  -   |    -    |    -
LOST                |     -     |     -     |     -    |      -      |  -   |    -    |    -
RETIRED             |     -     |     -     |     -    |      -      |  -   |    -    |    -
DISPOSED            |     -     |     -     |     -    |      -      |  -   |    -    |    -
```

> LOST, RETIRED, and DISPOSED are terminal states with no outgoing transitions.

## Error Handling

### Global Exception Handler

The backend uses a `@RestControllerAdvice` class (`GlobalExceptionHandler`) to catch all exceptions and return a consistent JSON envelope:

```java
{
  "data": null,
  "message": "Human-readable error description",
  "timestamp": "2026-07-10T14:30:00",
  "errors": [
    { "field": "email", "message": "must be a valid email address" }
  ]
}
```

### Error Categories and HTTP Status Mapping

| Exception Type | HTTP Status | When |
|---|---|---|
| `ValidationException` | 400 Bad Request | Invalid input fields, malformed data |
| `AuthenticationException` | 401 Unauthorized | Invalid credentials, expired/malformed JWT |
| `AccessDeniedException` | 403 Forbidden | Role insufficient for endpoint |
| `ResourceNotFoundException` | 404 Not Found | Entity ID not found |
| `ConflictException` | 409 Conflict | Duplicate email/tag, allocation conflict, booking overlap |
| `InvalidStateTransitionException` | 400 Bad Request | Lifecycle transition not permitted |
| `MethodArgumentNotValidException` | 400 Bad Request | Bean Validation failures (@Valid) |
| `OptimisticLockException` | 409 Conflict | Concurrent modification detected |
| `Exception` (catch-all) | 500 Internal Server Error | Unexpected errors (logged, not exposed) |

### Error Handling Patterns

1. **Input Validation**: Jakarta Bean Validation annotations (`@NotBlank`, `@Email`, `@Size`, `@Future`) on request DTOs. Spring triggers validation before the controller method body executes.
2. **Business Rule Violations**: Service layer throws domain-specific exceptions with descriptive messages.
3. **Concurrency Conflicts**: `@Version` optimistic locking on JPA entities for allocation and booking to prevent race conditions.
4. **Database Constraint Violations**: `DataIntegrityViolationException` is caught and mapped to 409 with a user-friendly message.
5. **Frontend Error Display**: Axios interceptor routes errors to a global MUI snackbar for non-field errors, or inline field helpers for 400 responses with field-level detail.

## Testing Strategy

### Unit Tests (JUnit 5 + Mockito)

- **Service layer**: Test business logic in isolation with mocked repositories. Focus on lifecycle state transitions, allocation conflict detection, booking overlap checks, role authorization.
- **Validation**: Test DTO validation annotations with specific valid/invalid examples.
- **JWT utilities**: Test token generation, parsing, expiry detection, claim extraction.
- **Frontend components**: React Testing Library for role-based rendering, form validation display, conditional UI.

### Integration Tests (@SpringBootTest + Testcontainers)

- **Repository layer**: Verify JPA mappings, FK constraints, unique constraints, cascade behavior against real MySQL 8.x via Testcontainers.
- **Controller layer**: MockMvc full request/response cycle including security filters, validation, error handling.
- **Database migrations**: Verify Flyway migration scripts apply cleanly.

### Property-Based Tests

Property-based tests target core domain logic where input variation reveals edge cases:

- **Lifecycle state machine**: Generate random state transition sequences and verify only valid transitions succeed.
- **Booking overlap detection**: Generate random time intervals and verify the overlap algorithm is correct.
- **Asset tag generation**: Generate registration sequences and verify uniqueness + AF-XXXX format.
- **JWT round-trip**: Encode/decode random user claims and verify all claims are preserved.
- **Role hierarchy**: For any endpoint, verify higher roles always have access if lower roles do.
- **Overdue detection**: Generate allocations with various dates and verify overdue marking accuracy.

### End-to-End Tests

- Critical user flows: signup → login → register asset → allocate → return.
- Manual during hackathon; automated E2E deferred to post-hackathon.

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Signup always creates Employee role

*For any* valid signup request (valid email format, password ≥ 8 chars, unique email), the created user record SHALL have role = EMPLOYEE and the response SHALL contain a valid JWT token with that role encoded.

**Validates: Requirements 1.1**

### Property 2: Invalid credentials always yield 401

*For any* email/password pair where either the email does not exist or the password does not match the stored hash, the login endpoint SHALL return HTTP 401 with no token in the response body.

**Validates: Requirements 2.2, 2.4**

### Property 3: Role hierarchy access control

*For any* protected API endpoint and any two roles where Role A is higher than Role B in the hierarchy (ADMIN > ASSET_MANAGER > DEPARTMENT_HEAD > EMPLOYEE), if Role B is permitted access to the endpoint, then Role A SHALL also be permitted access. Conversely, if Role A is forbidden, then Role B SHALL also be forbidden.

**Validates: Requirements 3.1, 3.2, 3.4**

### Property 4: Uniqueness constraints are enforced

*For any* entity with a uniqueness constraint (user email, department name, category name, asset tag, asset serial number), attempting to create a second record with the same unique field value SHALL be rejected with HTTP 409.

**Validates: Requirements 1.3, 6.4, 7.3, 9.4**

### Property 5: Asset tag format and sequentiality

*For any* newly registered asset, the auto-generated asset_tag SHALL match the regex pattern `^AF-\d{4}$` and SHALL be strictly greater than all previously generated tags when compared numerically.

**Validates: Requirements 9.2**

### Property 6: New assets start as Available

*For any* valid asset registration request, the created asset's lifecycle_state SHALL be AVAILABLE regardless of any other field values in the request.

**Validates: Requirements 9.3**

### Property 7: Lifecycle state transition validity

*For any* asset in a given lifecycle_state and any requested target state, the transition SHALL succeed if and only if the (current_state, target_state) pair is in the valid transition matrix. Invalid transitions SHALL be rejected with HTTP 400.

**Validates: Requirements 11.1, 11.3**

### Property 8: State transitions always produce history entries

*For any* successful lifecycle state transition on an asset, the system SHALL create exactly one new asset_history record with the correct previous_state, new_state, performing user, and timestamp.

**Validates: Requirements 11.2, 23.1**

### Property 9: Allocation conflict prevention

*For any* asset whose lifecycle_state is NOT Available, an allocation request targeting that asset SHALL be rejected with HTTP 409. Only assets in Available state can be allocated.

**Validates: Requirements 12.1, 12.2**

### Property 10: Allocation return round-trip

*For any* asset that is allocated and then returned, the asset's lifecycle_state SHALL return to AVAILABLE, the allocation record SHALL have is_active = false and a non-null actual_return_date, and condition_notes SHALL be persisted exactly as provided.

**Validates: Requirements 13.1, 13.2**

### Property 11: Booking overlap rejection

*For any* two booking requests on the same asset where their time intervals overlap (start1 < end2 AND start2 < end1, excluding the adjacent case where end1 = start2), the second request SHALL be rejected with HTTP 409.

**Validates: Requirements 16.2**

### Property 12: Booking time validity

*For any* booking request, the end_time SHALL be strictly greater than start_time. Requests violating this constraint SHALL be rejected with HTTP 400.

**Validates: Requirements 16.1**

### Property 13: Maintenance approval sets asset to Under Maintenance

*For any* maintenance request that is approved, the referenced asset's lifecycle_state SHALL transition to UNDER_MAINTENANCE. When that same request is resolved, the asset SHALL transition back to AVAILABLE.

**Validates: Requirements 17.2, 17.6**

### Property 14: Transfer approval workflow atomicity

*For any* approved transfer, the system SHALL atomically: (1) set transfer status to APPROVED, (2) close the current allocation (is_active = false), (3) create a new allocation to the requesting user, and (4) maintain the asset lifecycle_state as ALLOCATED.

**Validates: Requirements 14.2**

### Property 15: Overdue detection accuracy

*For any* open allocation (is_active = true) where expected_return_date < current_date, the allocation SHALL be marked as overdue (is_overdue = true). Allocations where expected_return_date >= current_date SHALL NOT be marked overdue.

**Validates: Requirements 15.1**

### Property 16: API response envelope consistency

*For any* API endpoint response (success or error), the JSON body SHALL contain the fields: `data`, `message`, and `timestamp`. The timestamp SHALL be a valid ISO-8601 datetime string.

**Validates: Requirements 21.2**

### Property 17: Pagination correctness

*For any* paginated endpoint called with page=P and size=S, the response SHALL contain at most S items, and the items SHALL correspond to the correct offset (P × S) in the full ordered result set.

**Validates: Requirements 21.4, 10.4**

### Property 18: Custom field definition round-trip

*For any* asset category with custom field definitions (field_name, field_type, is_required), retrieving the category SHALL return the exact same custom field definitions that were stored, preserving order, types, and required flags.

**Validates: Requirements 7.4**

### Property 19: Password hashing security

*For any* stored user record, the password_hash field SHALL be a valid bcrypt hash string (prefix `$2a$` or `$2b$`) with a cost factor ≥ 10, and SHALL NOT equal the plaintext password.

**Validates: Requirements 1.4**

### Property 20: Dashboard scope isolation

*For any* Department_Head user, the dashboard KPI values SHALL only include data from their department. Employee users SHALL only see personal data. Admin and Asset_Manager users SHALL see organization-wide data.

**Validates: Requirements 5.5**

### Property 21: History ordering

*For any* asset history query, the returned entries SHALL be sorted in reverse chronological order (newest created_at first), and pagination SHALL respect this ordering consistently.

**Validates: Requirements 23.3**
