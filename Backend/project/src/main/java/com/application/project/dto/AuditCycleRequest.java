package com.application.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AuditCycleRequest {
    @NotBlank(message = "Audit cycle name is required")
    private String name;
    private String description;
    @NotNull(message = "Start date is required")
    private LocalDate startDate;
    private LocalDate endDate;
}
