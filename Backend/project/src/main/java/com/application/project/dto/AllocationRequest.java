package com.application.project.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AllocationRequest {
    @NotNull(message = "Asset ID is required")
    private Long assetId;

    @NotNull(message = "Assignee ID is required")
    private Long assignedTo;

    @NotNull(message = "Expected return date is required")
    @Future(message = "Expected return date must be in the future")
    private LocalDate expectedReturnDate;
}
