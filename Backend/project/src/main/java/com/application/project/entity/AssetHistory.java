package com.application.project.entity;

import com.application.project.enums.HistoryEventType;
import com.application.project.enums.LifecycleState;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "asset_history")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssetHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "asset_id", nullable = false)
    private Long assetId;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false)
    private HistoryEventType eventType;

    @Enumerated(EnumType.STRING)
    @Column(name = "previous_state")
    private LifecycleState previousState;

    @Enumerated(EnumType.STRING)
    @Column(name = "new_state")
    private LifecycleState newState;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "performed_by", nullable = false)
    private Long performedBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
