package com.application.project.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.application.project.enums.BookingStatus;

import java.time.LocalDateTime;

// Time-slotted use of a shared/bookable asset (a room, a van). Distinct from
// Allocation: a booking is temporary and repeatable (many bookings over time
// for the same room), while an allocation is "this one person has this one
// asset right now." The overlap-rejection check (start1 < end2 AND
// start2 < end1) belongs in the service layer — the DB only enforces
// end_time > start_time via a CHECK constraint.
@Entity
@Table(name = "resource_bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "booked_by", nullable = false)
    private User bookedBy;

    @Column(length = 200)
    private String title;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private BookingStatus status = BookingStatus.UPCOMING;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Optimistic locking — guards against two concurrent booking requests for
    // overlapping slots racing past the overlap check at the same instant.
    @Version
    private Long version;
}
