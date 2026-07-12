package com.application.project.entity;

import com.application.project.enums.AuditFinding;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_assignments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cycle_id", nullable = false)
    private Long cycleId;

    @Column(name = "asset_id", nullable = false)
    private Long assetId;

    @Column(name = "auditor_id", nullable = false)
    private Long auditorId;

    @Enumerated(EnumType.STRING)
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
