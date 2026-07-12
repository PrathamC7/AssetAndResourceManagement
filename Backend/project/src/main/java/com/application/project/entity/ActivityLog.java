package com.application.project.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

// Generic "who did what" audit trail across the entire app — for
// accountability/compliance review, NOT a per-user inbox (that's
// Notification). Lowest build priority: if short on time, cut this down to
// logging just a handful of key actions (role promotion, asset disposal,
// audit-cycle close) rather than every CRUD call.
@Entity
@Table(name = "activity_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // e.g. "ALLOCATION_CREATED", "ROLE_PROMOTED", "AUDIT_CYCLE_CLOSED"
    @Column(nullable = false, length = 100)
    private String action;

    // Same loose-reference pattern as Notification — entityType/entityId
    // point at the affected row without a real FK (can't FK to "whichever
    // table this string names").
    @Column(name = "entity_type", nullable = false, length = 50)
    private String entityType;

    @Column(name = "entity_id", nullable = false)
    private Long entityId;

    @Column(columnDefinition = "JSON")
    private String details;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
