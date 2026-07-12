package com.application.project.service;

import com.application.project.dto.DashboardSummaryResponse;
import com.application.project.enums.AuditStatus;
import com.application.project.enums.BookingStatus;
import com.application.project.enums.LifecycleState;
import com.application.project.enums.TransferStatus;
import com.application.project.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

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
        CompletableFuture<Long> totalFuture = CompletableFuture.supplyAsync(assetRepository::count);
        CompletableFuture<Long> availFuture = CompletableFuture.supplyAsync(() -> assetRepository.countByLifecycleState(LifecycleState.AVAILABLE));
        CompletableFuture<Long> allocFuture = CompletableFuture.supplyAsync(() -> assetRepository.countByLifecycleState(LifecycleState.ALLOCATED));
        CompletableFuture<Long> maintFuture = CompletableFuture.supplyAsync(() -> assetRepository.countByLifecycleState(LifecycleState.UNDER_MAINTENANCE));
        CompletableFuture<Long> bookingUpFuture = CompletableFuture.supplyAsync(() -> bookingRepository.countByStatus(BookingStatus.UPCOMING));
        CompletableFuture<Long> bookingOnFuture = CompletableFuture.supplyAsync(() -> bookingRepository.countByStatus(BookingStatus.ONGOING));
        CompletableFuture<Long> transferFuture = CompletableFuture.supplyAsync(() -> transferRepository.countByStatus(TransferStatus.REQUESTED));
        CompletableFuture<Long> overdueFuture = CompletableFuture.supplyAsync(allocationRepository::countByIsOverdueTrue);
        CompletableFuture<Long> maintenanceFuture = CompletableFuture.supplyAsync(() -> maintenanceRepository.countByStatus(
                com.application.project.enums.MaintenanceStatus.PENDING));
        CompletableFuture<Long> auditFuture = CompletableFuture.supplyAsync(() -> auditCycleRepository.countByStatus(AuditStatus.OPEN));

        try {
            return DashboardSummaryResponse.builder()
                    .totalAssets(totalFuture.get())
                    .assetsAvailable(availFuture.get())
                    .assetsAllocated(allocFuture.get())
                    .assetsUnderMaintenance(maintFuture.get())
                    .activeBookings(bookingUpFuture.get() + bookingOnFuture.get())
                    .pendingTransfers(transferFuture.get())
                    .overdueReturns(overdueFuture.get())
                    .pendingMaintenanceRequests(maintenanceFuture.get())
                    .openAuditCycles(auditFuture.get())
                    .build();
        } catch (Exception e) {
            return getSummarySequential();
        }
    }

    private DashboardSummaryResponse getSummarySequential() {
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
                .openAuditCycles(auditCycleRepository.countByStatus(AuditStatus.OPEN))
                .build();
    }
}
