package com.application.project.service;

import com.application.project.dto.AssetRegistrationRequest;
import com.application.project.dto.AssetResponse;
import com.application.project.entity.Asset;
import com.application.project.entity.AssetCategory;
import com.application.project.entity.AssetHistory;
import com.application.project.enums.HistoryEventType;
import com.application.project.enums.LifecycleState;
import com.application.project.exception.ConflictException;
import com.application.project.exception.InvalidStateTransitionException;
import com.application.project.exception.ResourceNotFoundException;
import com.application.project.repository.AssetCategoryRepository;
import com.application.project.repository.AssetHistoryRepository;
import com.application.project.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AssetService {

    private final AssetRepository assetRepository;
    private final AssetCategoryRepository categoryRepository;
    private final AssetHistoryRepository historyRepository;

    @Transactional
    public AssetResponse register(AssetRegistrationRequest request, Long userId) {
        if (assetRepository.existsBySerialNumber(request.getSerialNumber())) {
            throw new ConflictException("Serial number already exists");
        }

        String assetTag = generateNextTag();

        Asset asset = Asset.builder()
                .assetTag(assetTag)
                .name(request.getName())
                .categoryId(request.getCategoryId())
                .serialNumber(request.getSerialNumber())
                .acquisitionDate(request.getAcquisitionDate())
                .cost(request.getCost() != null ? request.getCost() : BigDecimal.ZERO)
                .conditionStatus(request.getConditionStatus() != null ? request.getConditionStatus() : "Good")
                .location(request.getLocation())
                .photoUrl(request.getPhotoUrl())
                .isBookable(request.getIsBookable() != null ? request.getIsBookable() : false)
                .lifecycleState(LifecycleState.AVAILABLE)
                .customFields(request.getCustomFields())
                .registeredBy(userId)
                .build();

        asset = assetRepository.save(asset);

        // Record history
        historyRepository.save(AssetHistory.builder()
                .assetId(asset.getId())
                .eventType(HistoryEventType.REGISTRATION)
                .newState(LifecycleState.AVAILABLE)
                .description("Asset registered: " + asset.getName())
                .performedBy(userId)
                .build());

        return toResponse(asset);
    }

    public Page<AssetResponse> getAll(String search, LifecycleState state, Long categoryId, Pageable pageable) {
        return assetRepository.findFiltered(search, state, categoryId, pageable)
                .map(this::toResponse);
    }

    public AssetResponse getById(Long id) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + id));
        return toResponse(asset);
    }

    public Asset getEntityById(Long id) {
        return assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + id));
    }

    @Transactional
    public void transitionState(Long assetId, LifecycleState newState, Long userId, String description) {
        Asset asset = getEntityById(assetId);
        LifecycleState currentState = asset.getLifecycleState();

        if (!isValidTransition(currentState, newState)) {
            throw new InvalidStateTransitionException(
                    "Cannot transition from " + currentState + " to " + newState);
        }

        asset.setLifecycleState(newState);
        assetRepository.save(asset);

        historyRepository.save(AssetHistory.builder()
                .assetId(assetId)
                .eventType(HistoryEventType.STATE_CHANGE)
                .previousState(currentState)
                .newState(newState)
                .description(description)
                .performedBy(userId)
                .build());
    }

    private boolean isValidTransition(LifecycleState from, LifecycleState to) {
        if (from == to) return false;
        return switch (from) {
            case AVAILABLE -> true; // can go anywhere
            case ALLOCATED -> to == LifecycleState.AVAILABLE || to == LifecycleState.UNDER_MAINTENANCE
                    || to == LifecycleState.LOST || to == LifecycleState.RESERVED;
            case RESERVED -> to == LifecycleState.AVAILABLE || to == LifecycleState.ALLOCATED;
            case UNDER_MAINTENANCE -> to == LifecycleState.AVAILABLE;
            case LOST, RETIRED, DISPOSED -> false; // terminal states
        };
    }

    private String generateNextTag() {
        return assetRepository.findTopByOrderByIdDesc()
                .map(asset -> {
                    String tag = asset.getAssetTag();
                    int num = Integer.parseInt(tag.substring(3)) + 1;
                    return String.format("AF-%04d", num);
                })
                .orElse("AF-0001");
    }

    private AssetResponse toResponse(Asset asset) {
        String categoryName = categoryRepository.findById(asset.getCategoryId())
                .map(AssetCategory::getName)
                .orElse("Unknown");

        return AssetResponse.builder()
                .id(asset.getId())
                .assetTag(asset.getAssetTag())
                .name(asset.getName())
                .categoryId(asset.getCategoryId())
                .categoryName(categoryName)
                .serialNumber(asset.getSerialNumber())
                .acquisitionDate(asset.getAcquisitionDate())
                .cost(asset.getCost())
                .conditionStatus(asset.getConditionStatus())
                .location(asset.getLocation())
                .photoUrl(asset.getPhotoUrl())
                .isBookable(asset.getIsBookable())
                .lifecycleState(asset.getLifecycleState().name())
                .customFields(asset.getCustomFields())
                .registeredBy(asset.getRegisteredBy())
                .createdAt(asset.getCreatedAt())
                .updatedAt(asset.getUpdatedAt())
                .build();
    }
}
