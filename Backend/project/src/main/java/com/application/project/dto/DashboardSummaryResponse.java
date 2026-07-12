package com.application.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {
    private long totalAssets;
    private long assetsAvailable;
    private long assetsAllocated;
    private long assetsUnderMaintenance;
    private long activeBookings;
    private long pendingTransfers;
    private long overdueReturns;
    private long pendingMaintenanceRequests;
    private long openAuditCycles;
}
