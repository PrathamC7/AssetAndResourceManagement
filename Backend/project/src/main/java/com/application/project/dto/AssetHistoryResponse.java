package com.application.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssetHistoryResponse {
    private Long id;
    private Long assetId;
    private String eventType;
    private String previousState;
    private String newState;
    private String description;
    private Long performedBy;
    private String performedByName;
    private LocalDateTime createdAt;
}
