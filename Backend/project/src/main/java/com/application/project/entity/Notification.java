package com.application.project.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

// Per-user inbox items ("Your laptop request was approved"). This entity has
// no business logic of its own — other services write into it as a side
// effect of their own successful operations (e.g. AllocationService, on a
// successful allocate(), also inserts a Notification row for the assignee).
//
// referenceType/referenceId are a loose, non-FK pointer back to whatever
// triggered the notification (e.g. referenceType="ALLOCATION",
// referenceId=42). MySQL can't FK to "whichever table this string names",
// so these are plain columns — resolve them manually in code if ever needed,
// don't try to model this as a JPA relationship.
@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    // e.g. "ASSET_ASSIGNED", "BOOKING_CONFIRMED", "OVERDUE_RETURN" — kept as
    // a free-form string rather than an enum since the PDF's notification
    // list isn't closed and you may want to add types quickly.
    @Column(nullable = false, length = 50)
    private String type;

    @Column(name = "reference_type", length = 50)
    private String referenceType;

    @Column(name = "reference_id")
    private Long referenceId;

    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private Boolean isRead = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
