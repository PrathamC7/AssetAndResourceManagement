package com.application.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditResponse {
    private Long id;
    private String name;
    private String description;
    private String status;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long createdBy;
    private List<AssignmentResponse> assignments;
    private LocalDateTime createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssignmentResponse {
        private Long id;
        private Long assetId;
        private String assetName;
        private Long auditorId;
        private String auditorName;
        private String finding;
        private String notes;
        private LocalDateTime auditedAt;
    }
}
