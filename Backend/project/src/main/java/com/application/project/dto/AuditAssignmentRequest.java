package com.application.project.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AuditAssignmentRequest {
    @NotNull(message = "Asset ID is required")
    private Long assetId;

    @NotNull(message = "Auditor ID is required")
    private Long auditorId;
}
