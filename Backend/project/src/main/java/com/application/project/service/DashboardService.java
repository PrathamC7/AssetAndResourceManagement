package com.application.project.service;

import com.application.project.dto.DashboardSummaryResponse;
import com.application.project.enums.AuditStatus;
import com.application.project.enums.BookingStatus;
import com.application.project.enums.LifecycleState;
import com.application.project.enums.TransferStatus;
import com.application.project.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final AssetRepository assetRepository;
    private final AllocationRepository allocationRepository;
    private final ResourceBookingRepository bookingRepository;
    private final TransferRepository transferRepository;
    private final MaintenanceRequestRepository maintenanceRepository;
    private final AuditCycleRepository auditCycleRepository;

    private DashboardSummaryResponse cachedSummary;
    private long lastCacheTime = 0;
    private static final long CACHE_TTL_MS = 10000; // 10 seconds cache time-to-live

    public synchronized DashboardSummaryResponse getSummary() {
        long now = System.currentTimeMillis();
        if (cachedSummary != null && (now - lastCacheTime < CACHE_TTL_MS)) {
            return cachedSummary;
        }

        // Run sequentially on a single thread to reuse a single DB connection and prevent pool exhaustion
        DashboardSummaryResponse summary = DashboardSummaryResponse.builder()
                .totalAssets(assetRepository.count())
                .assetsAvailable(assetRepository.countByLifecycleState(LifecycleState.AVAILABLE))
                .assetsAllocated(assetRepository.countByLifecycleState(LifecycleState.ALLOCATED))
                .assetsUnderMaintenance(assetRepository.countByLifecycleState(LifecycleState.UNDER_MAINTENANCE))
                .activeBookings(bookingRepository.countByStatus(BookingStatus.UPCOMING) +
                        bookingRepository.countByStatus(BookingStatus.ONGOING))
                .pendingTransfers(transferRepository.countByStatus(TransferStatus.REQUESTED))
                .overdueReturns(allocationRepository.countByIsOverdueTrue())
                .pendingMaintenanceRequests(maintenanceRepository.countByStatus(
                        com.application.project.enums.MaintenanceStatus.PENDING))
                .openAuditCycles(auditCycleRepository.countByStatus(AuditStatus.OPEN))
                .build();

        cachedSummary = summary;
        lastCacheTime = now;
        return summary;
    }
}
