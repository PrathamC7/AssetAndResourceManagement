package com.application.project.service;

import com.application.project.dto.AuditAssignmentRequest;
import com.application.project.dto.AuditCycleRequest;
import com.application.project.dto.AuditResponse;
import com.application.project.entity.Asset;
import com.application.project.entity.AuditAssignment;
import com.application.project.entity.AuditCycle;
import com.application.project.entity.User;
import com.application.project.enums.AuditFinding;
import com.application.project.enums.AuditStatus;
import com.application.project.exception.ConflictException;
import com.application.project.exception.ResourceNotFoundException;
import com.application.project.repository.AssetRepository;
import com.application.project.repository.AuditAssignmentRepository;
import com.application.project.repository.AuditCycleRepository;
import com.application.project.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditCycleRepository cycleRepository;
    private final AuditAssignmentRepository assignmentRepository;
    private final AssetRepository assetRepository;
    private final UserRepository userRepository;

    @Transactional
    public AuditResponse createCycle(AuditCycleRequest request, Long userId) {
        AuditCycle cycle = AuditCycle.builder()
                .name(request.getName())
                .description(request.getDescription())
                .status(AuditStatus.OPEN)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .createdBy(userId)
                .build();
        cycle = cycleRepository.save(cycle);
        return toResponse(cycle);
    }

    @Transactional
    public AuditResponse.AssignmentResponse assignAsset(Long cycleId, AuditAssignmentRequest request, Long userId) {
        AuditCycle cycle = cycleRepository.findById(cycleId)
                .orElseThrow(() -> new ResourceNotFoundException("Audit cycle not found"));

        if (cycle.getStatus() != AuditStatus.OPEN) {
            throw new ConflictException("Cannot assign to a closed audit cycle");
        }

        AuditAssignment assignment = AuditAssignment.builder()
                .cycleId(cycleId)
                .assetId(request.getAssetId())
                .auditorId(request.getAuditorId())
                .build();
        assignment = assignmentRepository.save(assignment);

        String assetName = assetRepository.findById(assignment.getAssetId())
                .map(Asset::getName).orElse("Unknown");
        String auditorName = userRepository.findById(assignment.getAuditorId())
                .map(User::getName).orElse("Unknown");

        return AuditResponse.AssignmentResponse.builder()
                .id(assignment.getId())
                .assetId(assignment.getAssetId())
                .assetName(assetName)
                .auditorId(assignment.getAuditorId())
                .auditorName(auditorName)
                .build();
    }

    @Transactional
    public AuditResponse.AssignmentResponse recordFinding(Long assignmentId, String finding, String notes, Long userId) {
        AuditAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Audit assignment not found"));

        assignment.setFinding(AuditFinding.valueOf(finding.toUpperCase()));
        assignment.setNotes(notes);
        assignment.setAuditedAt(LocalDateTime.now());
        assignmentRepository.save(assignment);

        String assetName = assetRepository.findById(assignment.getAssetId())
                .map(Asset::getName).orElse("Unknown");
        String auditorName = userRepository.findById(assignment.getAuditorId())
                .map(User::getName).orElse("Unknown");

        return AuditResponse.AssignmentResponse.builder()
                .id(assignment.getId())
                .assetId(assignment.getAssetId())
                .assetName(assetName)
                .auditorId(assignment.getAuditorId())
                .auditorName(auditorName)
                .finding(assignment.getFinding().name())
                .notes(assignment.getNotes())
                .auditedAt(assignment.getAuditedAt())
                .build();
    }

    @Transactional
    public AuditResponse closeCycle(Long cycleId, Long userId) {
        AuditCycle cycle = cycleRepository.findById(cycleId)
                .orElseThrow(() -> new ResourceNotFoundException("Audit cycle not found"));
        cycle.setStatus(AuditStatus.CLOSED);
        cycleRepository.save(cycle);
        return toResponse(cycle);
    }

    public List<AuditResponse> getAll() {
        return cycleRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public AuditResponse getById(Long id) {
        AuditCycle cycle = cycleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Audit cycle not found"));
        return toResponse(cycle);
    }

    private AuditResponse toResponse(AuditCycle cycle) {
        List<AuditAssignment> assignments = assignmentRepository.findByCycleId(cycle.getId());

        List<AuditResponse.AssignmentResponse> assignmentResponses = assignments.stream()
                .map(a -> {
                    String assetName = assetRepository.findById(a.getAssetId())
                            .map(Asset::getName).orElse("Unknown");
                    String auditorName = userRepository.findById(a.getAuditorId())
                            .map(User::getName).orElse("Unknown");
                    return AuditResponse.AssignmentResponse.builder()
                            .id(a.getId())
                            .assetId(a.getAssetId())
                            .assetName(assetName)
                            .auditorId(a.getAuditorId())
                            .auditorName(auditorName)
                            .finding(a.getFinding() != null ? a.getFinding().name() : null)
                            .notes(a.getNotes())
                            .auditedAt(a.getAuditedAt())
                            .build();
                })
                .collect(Collectors.toList());

        return AuditResponse.builder()
                .id(cycle.getId())
                .name(cycle.getName())
                .description(cycle.getDescription())
                .status(cycle.getStatus().name())
                .startDate(cycle.getStartDate())
                .endDate(cycle.getEndDate())
                .createdBy(cycle.getCreatedBy())
                .assignments(assignmentResponses)
                .createdAt(cycle.getCreatedAt())
                .build();
    }
}
