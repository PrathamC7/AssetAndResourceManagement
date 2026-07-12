package com.application.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MaintenanceRequestDto {
    @NotNull(message = "Asset ID is required")
    private Long assetId;

    @NotBlank(message = "Issue description is required")
    private String issueDescription;

    private String priority;
    private String photoUrl;
}
