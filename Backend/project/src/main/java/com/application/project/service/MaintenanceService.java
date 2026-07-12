package com.application.project.service;

import com.application.project.dto.MaintenanceRequestDto;
import com.application.project.dto.MaintenanceResponse;
import com.application.project.entity.Asset;
import com.application.project.entity.AssetHistory;
import com.application.project.entity.MaintenanceRequest;
import com.application.project.entity.User;
import com.application.project.enums.HistoryEventType;
import com.application.project.enums.LifecycleState;
import com.application.project.enums.MaintenanceStatus;
import com.application.project.enums.Priority;
import com.application.project.exception.ConflictException;
import com.application.project.exception.ResourceNotFoundException;
import com.application.project.repository.AssetHistoryRepository;
import com.application.project.repository.AssetRepository;
import com.application.project.repository.MaintenanceRequestRepository;
import com.application.project.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaintenanceService {

    private final MaintenanceRequestRepository maintenanceRepository;
    private final AssetRepository assetRepository;
    private final UserRepository userRepository;
    private final AssetHistoryRepository historyRepository;

    @Transactional
    public MaintenanceResponse create(MaintenanceRequestDto request, Long userId) {
        assetRepository.findById(request.getAssetId())
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found"));

        Priority priority = Priority.MEDIUM;
        if (request.getPriority() != null) {
            priority = Priority.valueOf(request.getPriority().toUpperCase());
        }

        MaintenanceRequest mr = MaintenanceRequest.builder()
                .assetId(request.getAssetId())
                .requestedBy(userId)
                .issueDescription(request.getIssueDescription())
                .priority(priority)
                .status(MaintenanceStatus.PENDING)
                .photoUrl(request.getPhotoUrl())
                .build();

        mr = maintenanceRepository.save(mr);
        return toResponse(mr);
    }

    @Transactional
    public MaintenanceResponse approve(Long id, Long userId) {
        MaintenanceRequest mr = getEntity(id);
        validateStatus(mr, MaintenanceStatus.PENDING);

        mr.setStatus(MaintenanceStatus.APPROVED);
        maintenanceRepository.save(mr);

        // Put asset under maintenance
        Asset asset = assetRepository.findById(mr.getAssetId()).orElseThrow();
        LifecycleState prev = asset.getLifecycleState();
        asset.setLifecycleState(LifecycleState.UNDER_MAINTENANCE);
        assetRepository.save(asset);

        historyRepository.save(AssetHistory.builder()
                .assetId(asset.getId())
                .eventType(HistoryEventType.MAINTENANCE)
                .previousState(prev)
                .newState(LifecycleState.UNDER_MAINTENANCE)
                .description("Maintenance request approved")
                .performedBy(userId)
                .build());

        return toResponse(mr);
    }

    @Transactional
    public MaintenanceResponse reject(Long id, Long userId) {
        MaintenanceRequest mr = getEntity(id);
        validateStatus(mr, MaintenanceStatus.PENDING);
        mr.setStatus(MaintenanceStatus.REJECTED);
        maintenanceRepository.save(mr);
        return toResponse(mr);
    }

    @Transactional
    public MaintenanceResponse assignTechnician(Long id, Long technicianId, Long userId) {
        MaintenanceRequest mr = getEntity(id);
        if (mr.getStatus() != MaintenanceStatus.APPROVED) {
            throw new ConflictException("Request must be approved before assigning technician");
        }
        mr.setStatus(MaintenanceStatus.TECHNICIAN_ASSIGNED);
        mr.setAssignedTo(technicianId);
        maintenanceRepository.save(mr);
        return toResponse(mr);
    }

    @Transactional
    public MaintenanceResponse start(Long id, Long userId) {
        MaintenanceRequest mr = getEntity(id);
        if (mr.getStatus() != MaintenanceStatus.TECHNICIAN_ASSIGNED) {
            throw new ConflictException("Request must have a technician assigned before starting");
        }
        mr.setStatus(MaintenanceStatus.IN_PROGRESS);
        maintenanceRepository.save(mr);
        return toResponse(mr);
    }

    @Transactional
    public MaintenanceResponse resolve(Long id, String resolutionNotes, Long userId) {
        MaintenanceRequest mr = getEntity(id);
        if (mr.getStatus() != MaintenanceStatus.IN_PROGRESS) {
            throw new ConflictException("Request must be in progress to resolve");
        }

        mr.setStatus(MaintenanceStatus.RESOLVED);
        mr.setResolutionNotes(resolutionNotes);
        mr.setResolvedAt(LocalDateTime.now());
        maintenanceRepository.save(mr);

        // Restore asset to available
        Asset asset = assetRepository.findById(mr.getAssetId()).orElseThrow();
        asset.setLifecycleState(LifecycleState.AVAILABLE);
        assetRepository.save(asset);

        historyRepository.save(AssetHistory.builder()
                .assetId(asset.getId())
                .eventType(HistoryEventType.MAINTENANCE)
                .previousState(LifecycleState.UNDER_MAINTENANCE)
                .newState(LifecycleState.AVAILABLE)
                .description("Maintenance resolved: " + resolutionNotes)
                .performedBy(userId)
                .build());

        return toResponse(mr);
    }

    public List<MaintenanceResponse> getAll() {
        return maintenanceRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private MaintenanceRequest getEntity(Long id) {
        return maintenanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance request not found"));
    }

    private void validateStatus(MaintenanceRequest mr, MaintenanceStatus expected) {
        if (mr.getStatus() != expected) {
            throw new ConflictException("Request is not in " + expected + " status");
        }
    }

    private MaintenanceResponse toResponse(MaintenanceRequest mr) {
        String assetName = assetRepository.findById(mr.getAssetId())
                .map(Asset::getName).orElse("Unknown");
        String requesterName = userRepository.findById(mr.getRequestedBy())
                .map(User::getName).orElse("Unknown");
        String assigneeName = mr.getAssignedTo() != null ?
                userRepository.findById(mr.getAssignedTo()).map(User::getName).orElse("Unknown") : null;

        return MaintenanceResponse.builder()
                .id(mr.getId())
                .assetId(mr.getAssetId())
                .assetName(assetName)
                .requestedBy(mr.getRequestedBy())
                .requestedByName(requesterName)
                .issueDescription(mr.getIssueDescription())
                .priority(mr.getPriority().name())
                .status(mr.getStatus().name())
                .photoUrl(mr.getPhotoUrl())
                .assignedTo(mr.getAssignedTo())
                .assignedToName(assigneeName)
                .resolutionNotes(mr.getResolutionNotes())
                .resolvedAt(mr.getResolvedAt())
                .createdAt(mr.getCreatedAt())
                .updatedAt(mr.getUpdatedAt())
                .build();
    }
}
