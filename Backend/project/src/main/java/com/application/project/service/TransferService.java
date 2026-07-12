package com.application.project.service;

import com.application.project.dto.TransferRequest;
import com.application.project.dto.TransferResponse;
import com.application.project.entity.*;
import com.application.project.enums.HistoryEventType;
import com.application.project.enums.LifecycleState;
import com.application.project.enums.TransferStatus;
import com.application.project.exception.ConflictException;
import com.application.project.exception.ResourceNotFoundException;
import com.application.project.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransferService {

    private final TransferRepository transferRepository;
    private final AllocationRepository allocationRepository;
    private final AssetRepository assetRepository;
    private final UserRepository userRepository;
    private final AssetHistoryRepository historyRepository;

    @Transactional
    public TransferResponse requestTransfer(TransferRequest request, Long fromUserId) {
        Asset asset = assetRepository.findById(request.getAssetId())
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found"));

        if (asset.getLifecycleState() != LifecycleState.ALLOCATED) {
            throw new ConflictException("Asset must be allocated to request a transfer");
        }

        Transfer transfer = Transfer.builder()
                .assetId(request.getAssetId())
                .fromUserId(fromUserId)
                .toUserId(request.getToUserId())
                .reason(request.getReason())
                .status(TransferStatus.REQUESTED)
                .build();

        transfer = transferRepository.save(transfer);
        return toResponse(transfer);
    }

    @Transactional
    public TransferResponse approve(Long transferId, Long approvedBy) {
        Transfer transfer = transferRepository.findById(transferId)
                .orElseThrow(() -> new ResourceNotFoundException("Transfer not found"));

        if (transfer.getStatus() != TransferStatus.REQUESTED) {
            throw new ConflictException("Transfer is not in REQUESTED status");
        }

        transfer.setStatus(TransferStatus.APPROVED);
        transfer.setApprovedBy(approvedBy);
        transfer.setApprovedAt(LocalDateTime.now());
        transferRepository.save(transfer);

        // Close current allocation
        allocationRepository.findByAssetIdAndIsActive(transfer.getAssetId(), true)
                .ifPresent(alloc -> {
                    alloc.setIsActive(false);
                    alloc.setActualReturnDate(LocalDateTime.now());
                    allocationRepository.save(alloc);
                });

        // Create new allocation for target user
        Allocation newAlloc = Allocation.builder()
                .assetId(transfer.getAssetId())
                .assignedTo(transfer.getToUserId())
                .allocatedBy(approvedBy)
                .expectedReturnDate(java.time.LocalDate.now().plusDays(30))
                .isActive(true)
                .isOverdue(false)
                .build();
        allocationRepository.save(newAlloc);

        historyRepository.save(AssetHistory.builder()
                .assetId(transfer.getAssetId())
                .eventType(HistoryEventType.TRANSFER)
                .previousState(LifecycleState.ALLOCATED)
                .newState(LifecycleState.ALLOCATED)
                .description("Asset transferred from user " + transfer.getFromUserId() + " to user " + transfer.getToUserId())
                .performedBy(approvedBy)
                .build());

        return toResponse(transfer);
    }

    @Transactional
    public TransferResponse reject(Long transferId, Long rejectedBy) {
        Transfer transfer = transferRepository.findById(transferId)
                .orElseThrow(() -> new ResourceNotFoundException("Transfer not found"));

        if (transfer.getStatus() != TransferStatus.REQUESTED) {
            throw new ConflictException("Transfer is not in REQUESTED status");
        }

        transfer.setStatus(TransferStatus.REJECTED);
        transfer.setApprovedBy(rejectedBy);
        transfer.setApprovedAt(LocalDateTime.now());
        transferRepository.save(transfer);

        return toResponse(transfer);
    }

    public List<TransferResponse> getAll() {
        return transferRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private TransferResponse toResponse(Transfer transfer) {
        String assetName = assetRepository.findById(transfer.getAssetId())
                .map(Asset::getName).orElse("Unknown");
        String fromName = userRepository.findById(transfer.getFromUserId())
                .map(User::getName).orElse("Unknown");
        String toName = userRepository.findById(transfer.getToUserId())
                .map(User::getName).orElse("Unknown");

        return TransferResponse.builder()
                .id(transfer.getId())
                .assetId(transfer.getAssetId())
                .assetName(assetName)
                .fromUserId(transfer.getFromUserId())
                .fromUserName(fromName)
                .toUserId(transfer.getToUserId())
                .toUserName(toName)
                .reason(transfer.getReason())
                .status(transfer.getStatus().name())
                .approvedBy(transfer.getApprovedBy())
                .approvedAt(transfer.getApprovedAt())
                .createdAt(transfer.getCreatedAt())
                .build();
    }
}
