package com.application.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class AssetRegistrationRequest {
    @NotBlank(message = "Asset name is required")
    private String name;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotBlank(message = "Serial number is required")
    private String serialNumber;

    @NotNull(message = "Acquisition date is required")
    private LocalDate acquisitionDate;

    private BigDecimal cost;
    private String conditionStatus;
    private String location;
    private String photoUrl;
    private Boolean isBookable;
    private String customFields;
}
