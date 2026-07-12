package com.application.project.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TransferRequest {
    @NotNull(message = "Asset ID is required")
    private Long assetId;

    @NotNull(message = "Target user ID is required")
    private Long toUserId;

    private String reason;
}
