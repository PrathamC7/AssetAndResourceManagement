package com.application.project.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

// "This asset is currently held by this person." isActive=true means it's
// the CURRENT holder; on return, don't delete the row — set isActive=false
// and fill actualReturnDate, so this table doubles as its own history.
// This is the entity behind the double-allocation conflict check (the
// "Priya/Raj" demo scenario).
@Entity
@Table(name = "allocations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Allocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assigned_to", nullable = false)
    private User assignedTo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "allocated_by", nullable = false)
    private User allocatedBy;

    // Nullable — supports permanent/open-ended allocations per the PDF spec.
    @Column(name = "expected_return_date")
    private LocalDate expectedReturnDate;

    @Column(name = "actual_return_date")
    private LocalDateTime actualReturnDate;

    @Column(name = "condition_notes", columnDefinition = "TEXT")
    private String conditionNotes;

    @Column(name = "is_overdue", nullable = false)
    @Builder.Default
    private Boolean isOverdue = false;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Optimistic locking — guards against two concurrent allocation attempts
    // on the same asset racing past the "is it Available?" check.
    @Version
    private Long version;
}
