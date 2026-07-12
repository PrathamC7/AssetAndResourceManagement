package com.application.project.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.application.project.enums.AuditFinding;

import java.time.LocalDateTime;

// The join/checklist table between an AuditCycle and the assets it covers —
// one row per (cycle, asset) pair. `finding` stays null until the auditor
// actually verifies the asset. The DB enforces one row per (cycle_id,
// asset_id) via a unique constraint — mirror that expectation in the service
// layer rather than relying on the DB to reject a duplicate mid-flow.
@Entity
@Table(
    name = "audit_assignments",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_audit_cycle_asset",
        columnNames = {"cycle_id", "asset_id"}
    )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cycle_id", nullable = false)
    private AuditCycle cycle;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "auditor_id", nullable = false)
    private User auditor;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private AuditFinding finding;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "audited_at")
    private LocalDateTime auditedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
