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