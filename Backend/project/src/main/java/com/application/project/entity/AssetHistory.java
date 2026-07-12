package com.application.project.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import com.application.project.enums.HistoryEventType;
import com.application.project.enums.LifecycleState;

import java.time.LocalDateTime;

// Append-only audit trail for an asset's lifecycle. Never update or delete a
// row here — every service method that changes Asset.lifecycleState should
// insert exactly one AssetHistory row in the same transaction.
@Entity
@Table(name = "asset_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssetHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false, length = 30)
    private HistoryEventType eventType;

    @Enumerated(EnumType.STRING)
    @Column(name = "previous_state", length = 30)
    private LifecycleState previousState;

    @Enumerated(EnumType.STRING)
    @Column(name = "new_state", length = 30)
    private LifecycleState newState;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "performed_by", nullable = false)
    private User performedBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
