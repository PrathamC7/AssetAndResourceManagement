package com.application.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AllocationResponse {
    private Long id;
    private Long assetId;
    private String assetName;
    private String assetTag;
    private Long assignedTo;
    private String assignedToName;
    private Long allocatedBy;
    private LocalDate expectedReturnDate;
    private LocalDateTime actualReturnDate;
    private String conditionNotes;
    private Boolean isOverdue;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
