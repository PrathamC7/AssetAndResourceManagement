-- ==============================
-- AssetFlow - Database Schema (MySQL)
-- Generated from JPA Entity definitions
-- Note: Since ddl-auto=update is configured, Hibernate will create/update
-- these tables automatically. This file is for reference and manual setup.
-- ==============================

CREATE DATABASE IF NOT EXISTS assetflow
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE assetflow;

-- ──────────────────────────────────────────────────────────────────────────────
-- 1. Departments
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS departments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  parent_id BIGINT NULL,
  head_id BIGINT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_dept_parent FOREIGN KEY (parent_id) REFERENCES departments(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────────────
-- 2. Users
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(30) NOT NULL DEFAULT 'EMPLOYEE',
  department_id BIGINT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_user_dept FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add the FK from departments.head_id -> users.id after users table exists
ALTER TABLE departments
  ADD CONSTRAINT fk_dept_head FOREIGN KEY (head_id) REFERENCES users(id) ON DELETE SET NULL;

-- ──────────────────────────────────────────────────────────────────────────────
-- 3. Asset Categories
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS asset_categories (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────────────
-- 4. Category Custom Fields (MVP scope - optional)
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS category_custom_fields (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  category_id BIGINT NOT NULL,
  field_name VARCHAR(100) NOT NULL,
  field_type VARCHAR(50) NOT NULL DEFAULT 'TEXT',
  is_required BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_ccf_category FOREIGN KEY (category_id) REFERENCES asset_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────────────
-- 5. Assets
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assets (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  asset_tag VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  category_id BIGINT NOT NULL,
  serial_number VARCHAR(100) NOT NULL UNIQUE,
  acquisition_date DATE NOT NULL,
  cost DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  condition_status VARCHAR(50) NOT NULL DEFAULT 'Good',
  location VARCHAR(200),
  photo_url VARCHAR(500),
  is_bookable BOOLEAN NOT NULL DEFAULT FALSE,
  lifecycle_state VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE',
  custom_fields JSON,
  registered_by BIGINT NOT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_asset_category FOREIGN KEY (category_id) REFERENCES asset_categories(id) ON DELETE RESTRICT,
  CONSTRAINT fk_asset_registered_by FOREIGN KEY (registered_by) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_asset_lifecycle (lifecycle_state),
  INDEX idx_asset_category (category_id),
  INDEX idx_asset_tag (asset_tag)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────────────
-- 6. Allocations
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS allocations (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  asset_id BIGINT NOT NULL,
  assigned_to BIGINT NOT NULL,
  assigned_by BIGINT NOT NULL,
  expected_return_date DATE,
  actual_return_date DATE,
  return_condition VARCHAR(50),
  status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_alloc_asset FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE RESTRICT,
  CONSTRAINT fk_alloc_assigned_to FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT fk_alloc_assigned_by FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_alloc_status (status),
  INDEX idx_alloc_asset (asset_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────────────
-- 7. Transfers
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transfers (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  asset_id BIGINT NOT NULL,
  from_user_id BIGINT NOT NULL,
  to_user_id BIGINT NOT NULL,
  requested_by BIGINT NOT NULL,
  reason TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  approved_by BIGINT,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_transfer_asset FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE RESTRICT,
  CONSTRAINT fk_transfer_from FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT fk_transfer_to FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT fk_transfer_requested_by FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT fk_transfer_approved_by FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_transfer_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────────────
-- 8. Resource Bookings
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS resource_bookings (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  asset_id BIGINT NOT NULL,
  booked_by BIGINT NOT NULL,
  title VARCHAR(200),
  start_time DATETIME(6) NOT NULL,
  end_time DATETIME(6) NOT NULL,
  notes TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'UPCOMING',
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_booking_asset FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE RESTRICT,
  CONSTRAINT fk_booking_user FOREIGN KEY (booked_by) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_booking_asset_time (asset_id, start_time, end_time),
  INDEX idx_booking_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────────────
-- 9. Maintenance Requests
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  asset_id BIGINT NOT NULL,
  reported_by BIGINT NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
  status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  assigned_to BIGINT,
  resolution_notes TEXT,
  resolved_at DATETIME(6),
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_maint_asset FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE RESTRICT,
  CONSTRAINT fk_maint_reported_by FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT fk_maint_assigned_to FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_maint_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────────────
-- 10. Audit Cycles
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_cycles (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'OPEN',
  start_date DATE NOT NULL,
  end_date DATE,
  created_by BIGINT NOT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_audit_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────────────
-- 11. Audit Assignments
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_assignments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  cycle_id BIGINT NOT NULL,
  asset_id BIGINT NOT NULL,
  auditor_id BIGINT NOT NULL,
  finding VARCHAR(30),
  notes TEXT,
  audited_at DATETIME(6),
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_audit_assign_cycle FOREIGN KEY (cycle_id) REFERENCES audit_cycles(id) ON DELETE CASCADE,
  CONSTRAINT fk_audit_assign_asset FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE RESTRICT,
  CONSTRAINT fk_audit_assign_auditor FOREIGN KEY (auditor_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────────────
-- 12. Notifications
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notif_user_read (user_id, is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────────────
-- 13. Activity Logs
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activity_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id BIGINT,
  details TEXT,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_log_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_log_created (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────────────
-- 14. Asset History (lifecycle state transitions)
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS asset_history (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  asset_id BIGINT NOT NULL,
  from_state VARCHAR(30),
  to_state VARCHAR(30) NOT NULL,
  changed_by BIGINT,
  reason TEXT,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_history_asset FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
  CONSTRAINT fk_history_changed_by FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_history_asset (asset_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
