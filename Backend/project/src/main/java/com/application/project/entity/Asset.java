package com.application.project.entity;

import com.application.project.enums.LifecycleState;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "assets")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "asset_tag", nullable = false, unique = true, length = 10)
    private String assetTag;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(name = "category_id", nullable = false)
    private Long categoryId;

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
    @Column(name = "lifecycle_state", nullable = false)
    @Builder.Default
    private LifecycleState lifecycleState = LifecycleState.AVAILABLE;

    @Column(name = "custom_fields", columnDefinition = "TEXT")
    private String customFields;

    @Column(name = "registered_by", nullable = false)
    private Long registeredBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
