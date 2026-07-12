package com.application.project.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.application.project.enums.LifecycleState;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

// The hub entity of the whole schema — Allocation, Transfer, ResourceBooking,
// MaintenanceRequest, AuditAssignment, and AssetHistory all point back here.
// `lifecycleState` is the single most important field in the system: every
// other module reads or mutates it under its own rules.
@Entity
@Table(name = "assets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Auto-generated in the service layer (format AF-0001), not by the DB.
    @Column(name = "asset_tag", nullable = false, unique = true, length = 10)
    private String assetTag;

    @Column(nullable = false, length = 200)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private AssetCategory category;

    @Column(name = "serial_number", nullable = false, unique = true, length = 100)
    private String serialNumber;

    @Column(name = "acquisition_date", nullable = false)
    private LocalDate acquisitionDate;

    @Column(nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal cost = BigDecimal.ZERO;

    @Column(name = "condition_status", nullable = false, length = 50)
    @Builder.Default
    private String conditionStatus = "Good";

    @Column(length = 200)
    private String location;

    @Column(name = "photo_url", length = 500)
    private String photoUrl;

    @Column(name = "is_bookable", nullable = false)
    @Builder.Default
    private Boolean isBookable = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "lifecycle_state", nullable = false, length = 30)
    @Builder.Default
    private LifecycleState lifecycleState = LifecycleState.AVAILABLE;

    // Cut from MVP scope alongside CategoryCustomField — leave null/unused.
    @Column(name = "custom_fields", columnDefinition = "JSON")
    private String customFields;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "registered_by", nullable = false)
    private User registeredBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
