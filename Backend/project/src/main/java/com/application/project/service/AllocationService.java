package com.application.project.service;

import com.application.project.dto.AllocationRequest;
import com.application.project.dto.AllocationResponse;
import com.application.project.dto.ReturnRequest;
import com.application.project.entity.Allocation;
import com.application.project.entity.Asset;
import com.application.project.entity.AssetHistory;
import com.application.project.entity.User;
import com.application.project.enums.HistoryEventType;
import com.application.project.enums.LifecycleState;
import com.application.project.exception.ConflictException;
import com.application.project.exception.ResourceNotFoundException;
import com.application.project.repository.AllocationRepository;
import com.application.project.repository.AssetHistoryRepository;
import com.application.project.repository.AssetRepository;
import com.application.project.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AllocationService {

    private final AllocationRepository allocationRepository;
    private final AssetRepository assetRepository;
    private final UserRepository userRepository;
    private final AssetHistoryRepository historyRepository;

    @Transactional
    public AllocationResponse allocate(AllocationRequest request, Long allocatedBy) {
        Asset asset = assetRepository.findById(request.getAssetId())
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found"));

        if (asset.getLifecycleState() != LifecycleState.AVAILABLE) {
            throw new ConflictException("Asset is not available. Current state: " + asset.getLifecycleState());
        }

        User assignee = userRepository.findById(request.getAssignedTo())
                .orElseThrow(() -> new ResourceNotFoundException("Assignee user not found"));

        User allocator = userRepository.findById(allocatedBy)
                .orElseThrow(() -> new ResourceNotFoundException("Allocator user not found"));

        Allocation allocation = Allocation.builder()
                .asset(asset)
                .assignedTo(assignee)
                .allocatedBy(allocator)
                .expectedReturnDate(request.getExpectedReturnDate())
                .isActive(true)
                .isOverdue(false)
                .build();

        allocation = allocationRepository.save(allocation);

        asset.setLifecycleState(LifecycleState.ALLOCATED);
        assetRepository.save(asset);

        historyRepository.save(AssetHistory.builder()
                .asset(asset)
                .eventType(HistoryEventType.ALLOCATION)
                .previousState(LifecycleState.AVAILABLE)
                .newState(LifecycleState.ALLOCATED)
                .description("Asset allocated to user " + assignee.getId())
                .performedBy(allocator)
                .build());

        return toResponse(allocation);
    }

    @Transactional
    public AllocationResponse returnAsset(Long allocationId, ReturnRequest request, Long userId) {
        Allocation allocation = allocationRepository.findById(allocationId)
                .orElseThrow(() -> new ResourceNotFoundException("Allocation not found"));

        if (!allocation.getIsActive()) {
            throw new ConflictException("Allocation is already closed");
        }

        User performer = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        allocation.setIsActive(false);
        allocation.setActualReturnDate(LocalDateTime.now());
        allocation.setConditionNotes(request.getConditionNotes());
        allocationRepository.save(allocation);

        Asset asset = allocation.getAsset();
        if (asset == null) {
            throw new ResourceNotFoundException("Asset associated with allocation not found");
        }
        asset.setLifecycleState(LifecycleState.AVAILABLE);
        assetRepository.save(asset);

        historyRepository.save(AssetHistory.builder()
                .asset(asset)
                .eventType(HistoryEventType.RETURN)
                .previousState(LifecycleState.ALLOCATED)
                .newState(LifecycleState.AVAILABLE)
                .description("Asset returned by user " + userId)
                .performedBy(performer)
                .build());

        return toResponse(allocation);
    }

    public List<AllocationResponse> getActiveAllocations() {
        return allocationRepository.findAll().stream()
                .filter(Allocation::getIsActive)
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private AllocationResponse toResponse(Allocation alloc) {
        String assetName = alloc.getAsset() != null ? alloc.getAsset().getName() : "Unknown";
        String assetTag = alloc.getAsset() != null ? alloc.getAsset().getAssetTag() : "Unknown";
        String assigneeName = alloc.getAssignedTo() != null ? alloc.getAssignedTo().getName() : "Unknown";

        return AllocationResponse.builder()
                .id(alloc.getId())
                .assetId(alloc.getAsset() != null ? alloc.getAsset().getId() : null)
                .assetName(assetName)
                .assetTag(assetTag)
                .assignedTo(alloc.getAssignedTo() != null ? alloc.getAssignedTo().getId() : null)
                .assignedToName(assigneeName)
                .allocatedBy(alloc.getAllocatedBy() != null ? alloc.getAllocatedBy().getId() : null)
                .expectedReturnDate(alloc.getExpectedReturnDate())
                .actualReturnDate(alloc.getActualReturnDate())
                .conditionNotes(alloc.getConditionNotes())
                .isOverdue(alloc.getIsOverdue())
                .isActive(alloc.getIsActive())
                .createdAt(alloc.getCreatedAt())
                .build();
    }
}
