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

        Allocation allocation = Allocation.builder()
                .assetId(request.getAssetId())
                .assignedTo(request.getAssignedTo())
                .allocatedBy(allocatedBy)
                .expectedReturnDate(request.getExpectedReturnDate())
                .isActive(true)
                .isOverdue(false)
                .build();

        allocation = allocationRepository.save(allocation);

        asset.setLifecycleState(LifecycleState.ALLOCATED);
        assetRepository.save(asset);

        historyRepository.save(AssetHistory.builder()
                .assetId(asset.getId())
                .eventType(HistoryEventType.ALLOCATION)
                .previousState(LifecycleState.AVAILABLE)
                .newState(LifecycleState.ALLOCATED)
                .description("Asset allocated to user " + request.getAssignedTo())
                .performedBy(allocatedBy)
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

        allocation.setIsActive(false);
        allocation.setActualReturnDate(LocalDateTime.now());
        allocation.setConditionNotes(request.getConditionNotes());
        allocationRepository.save(allocation);

        Asset asset = assetRepository.findById(allocation.getAssetId())
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found"));
        asset.setLifecycleState(LifecycleState.AVAILABLE);
        assetRepository.save(asset);

        historyRepository.save(AssetHistory.builder()
                .assetId(asset.getId())
                .eventType(HistoryEventType.RETURN)
                .previousState(LifecycleState.ALLOCATED)
                .newState(LifecycleState.AVAILABLE)
                .description("Asset returned by user " + userId)
                .performedBy(userId)
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
        String assetName = assetRepository.findById(alloc.getAssetId())
                .map(Asset::getName).orElse("Unknown");
        String assetTag = assetRepository.findById(alloc.getAssetId())
                .map(Asset::getAssetTag).orElse("Unknown");
        String assigneeName = userRepository.findById(alloc.getAssignedTo())
                .map(User::getName).orElse("Unknown");

        return AllocationResponse.builder()
                .id(alloc.getId())
                .assetId(alloc.getAssetId())
                .assetName(assetName)
                .assetTag(assetTag)
                .assignedTo(alloc.getAssignedTo())
                .assignedToName(assigneeName)
                .allocatedBy(alloc.getAllocatedBy())
                .expectedReturnDate(alloc.getExpectedReturnDate())
                .actualReturnDate(alloc.getActualReturnDate())
                .conditionNotes(alloc.getConditionNotes())
                .isOverdue(alloc.getIsOverdue())
                .isActive(alloc.getIsActive())
                .createdAt(alloc.getCreatedAt())
                .build();
    }
}
