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
public class MaintenanceResponse {
    private Long id;
    private Long assetId;
    private String assetName;
    private Long requestedBy;
    private String requestedByName;
    private String issueDescription;
    private String priority;
    private String status;
    private String photoUrl;
    private Long assignedTo;
    private String assignedToName;
    private String resolutionNotes;
    private LocalDateTime resolvedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
