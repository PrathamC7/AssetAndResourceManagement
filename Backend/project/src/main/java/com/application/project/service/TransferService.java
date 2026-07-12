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

        User fromUser = userRepository.findById(fromUserId)
                .orElseThrow(() -> new ResourceNotFoundException("From user not found"));

        User toUser = userRepository.findById(request.getToUserId())
                .orElseThrow(() -> new ResourceNotFoundException("To user not found"));

        Transfer transfer = Transfer.builder()
                .asset(asset)
                .fromUser(fromUser)
                .toUser(toUser)
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

        User approver = userRepository.findById(approvedBy)
                .orElseThrow(() -> new ResourceNotFoundException("Approver user not found"));

        transfer.setStatus(TransferStatus.APPROVED);
        transfer.setApprovedBy(approver);
        transfer.setApprovedAt(LocalDateTime.now());
        transferRepository.save(transfer);

        // Close current allocation
        if (transfer.getAsset() != null) {
            allocationRepository.findByAssetIdAndIsActive(transfer.getAsset().getId(), true)
                    .ifPresent(alloc -> {
                        alloc.setIsActive(false);
                        alloc.setActualReturnDate(LocalDateTime.now());
                        allocationRepository.save(alloc);
                    });
        }

        // Create new allocation for target user
        Allocation newAlloc = Allocation.builder()
                .asset(transfer.getAsset())
                .assignedTo(transfer.getToUser())
                .allocatedBy(approver)
                .expectedReturnDate(java.time.LocalDate.now().plusDays(30))
                .isActive(true)
                .isOverdue(false)
                .build();
        allocationRepository.save(newAlloc);

        historyRepository.save(AssetHistory.builder()
                .asset(transfer.getAsset())
                .eventType(HistoryEventType.TRANSFER)
                .previousState(LifecycleState.ALLOCATED)
                .newState(LifecycleState.ALLOCATED)
                .description("Asset transferred from user " + transfer.getFromUser().getId() + " to user " + transfer.getToUser().getId())
                .performedBy(approver)
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

        User rejecter = userRepository.findById(rejectedBy)
                .orElseThrow(() -> new ResourceNotFoundException("Rejecter user not found"));

        transfer.setStatus(TransferStatus.REJECTED);
        transfer.setApprovedBy(rejecter);
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
        String assetName = transfer.getAsset() != null ? transfer.getAsset().getName() : "Unknown";
        String fromName = transfer.getFromUser() != null ? transfer.getFromUser().getName() : "Unknown";
        String toName = transfer.getToUser() != null ? transfer.getToUser().getName() : "Unknown";

        return TransferResponse.builder()
                .id(transfer.getId())
                .assetId(transfer.getAsset() != null ? transfer.getAsset().getId() : null)
                .assetName(assetName)
                .fromUserId(transfer.getFromUser() != null ? transfer.getFromUser().getId() : null)
                .fromUserName(fromName)
                .toUserId(transfer.getToUser() != null ? transfer.getToUser().getId() : null)
                .toUserName(toName)
                .reason(transfer.getReason())
                .status(transfer.getStatus().name())
                .approvedBy(transfer.getApprovedBy() != null ? transfer.getApprovedBy().getId() : null)
                .approvedAt(transfer.getApprovedAt())
                .createdAt(transfer.getCreatedAt())
                .build();
    }
}
