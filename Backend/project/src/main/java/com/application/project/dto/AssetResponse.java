package com.application.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssetResponse {
    private Long id;
    private String assetTag;
    private String name;
    private Long categoryId;
    private String categoryName;
    private String serialNumber;
    private LocalDate acquisitionDate;
    private BigDecimal cost;
    private String conditionStatus;
    private String location;
    private String photoUrl;
    private Boolean isBookable;
    private String lifecycleState;
    private String customFields;
    private Long registeredBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
