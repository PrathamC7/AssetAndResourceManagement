package com.application.project.service;

import com.application.project.dto.AssetRegistrationRequest;
import com.application.project.dto.AssetResponse;
import com.application.project.entity.Asset;
import com.application.project.entity.AssetCategory;
import com.application.project.entity.AssetHistory;
import com.application.project.entity.User;
import com.application.project.enums.HistoryEventType;
import com.application.project.enums.LifecycleState;
import com.application.project.exception.ConflictException;
import com.application.project.exception.InvalidStateTransitionException;
import com.application.project.exception.ResourceNotFoundException;
import com.application.project.repository.AssetCategoryRepository;
import com.application.project.repository.AssetHistoryRepository;
import com.application.project.repository.AssetRepository;
import com.application.project.repository.UserRepository;
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
    private final UserRepository userRepository;

    @Transactional
    public AssetResponse register(AssetRegistrationRequest request, Long userId) {
        if (assetRepository.existsBySerialNumber(request.getSerialNumber())) {
            throw new ConflictException("Serial number already exists");
        }

        String assetTag = generateNextTag();

        AssetCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Asset category not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Asset asset = Asset.builder()
                .assetTag(assetTag)
                .name(request.getName())
                .category(category)
                .serialNumber(request.getSerialNumber())
                .acquisitionDate(request.getAcquisitionDate())
                .cost(request.getCost() != null ? request.getCost() : BigDecimal.ZERO)
                .conditionStatus(request.getConditionStatus() != null ? request.getConditionStatus() : "Good")
                .location(request.getLocation())
                .photoUrl(request.getPhotoUrl())
                .isBookable(request.getIsBookable() != null ? request.getIsBookable() : false)
                .lifecycleState(LifecycleState.AVAILABLE)
                .customFields(request.getCustomFields())
                .registeredBy(user)
                .build();

        asset = assetRepository.save(asset);

        // Record history
        historyRepository.save(AssetHistory.builder()
                .asset(asset)
                .eventType(HistoryEventType.REGISTRATION)
                .newState(LifecycleState.AVAILABLE)
                .description("Asset registered: " + asset.getName())
                .performedBy(user)
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

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        asset.setLifecycleState(newState);
        assetRepository.save(asset);

        historyRepository.save(AssetHistory.builder()
                .asset(asset)
                .eventType(HistoryEventType.STATE_CHANGE)
                .previousState(currentState)
                .newState(newState)
                .description(description)
                .performedBy(user)
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

    public Page<com.application.project.dto.AssetHistoryResponse> getHistory(Long assetId, Pageable pageable) {
        if (!assetRepository.existsById(assetId)) {
            throw new ResourceNotFoundException("Asset not found");
        }
        return historyRepository.findByAssetIdOrderByCreatedAtDesc(assetId, pageable)
                .map(this::toHistoryResponse);
    }

    private com.application.project.dto.AssetHistoryResponse toHistoryResponse(AssetHistory history) {
        String userName = history.getPerformedBy() != null ? history.getPerformedBy().getName() : "System";
        Long userId = history.getPerformedBy() != null ? history.getPerformedBy().getId() : null;

        return com.application.project.dto.AssetHistoryResponse.builder()
                .id(history.getId())
                .assetId(history.getAsset() != null ? history.getAsset().getId() : null)
                .eventType(history.getEventType().name())
                .previousState(history.getPreviousState() != null ? history.getPreviousState().name() : null)
                .newState(history.getNewState() != null ? history.getNewState().name() : null)
                .description(history.getDescription())
                .performedBy(userId)
                .performedByName(userName)
                .createdAt(history.getCreatedAt())
                .build();
    }

    private AssetResponse toResponse(Asset asset) {
        String categoryName = asset.getCategory() != null ? asset.getCategory().getName() : "Unknown";

        return AssetResponse.builder()
                .id(asset.getId())
                .assetTag(asset.getAssetTag())
                .name(asset.getName())
                .categoryId(asset.getCategory() != null ? asset.getCategory().getId() : null)
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
                .registeredBy(asset.getRegisteredBy() != null ? asset.getRegisteredBy().getId() : null)
                .createdAt(asset.getCreatedAt())
                .updatedAt(asset.getUpdatedAt())
                .build();
    }
}
