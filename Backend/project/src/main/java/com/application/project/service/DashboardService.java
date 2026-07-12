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

    public DashboardSummaryResponse getSummary() {
        return DashboardSummaryResponse.builder()
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
                .openAuditCycles(auditCycleRepository.findByStatus(AuditStatus.OPEN).size())
                .build();
    }
}
