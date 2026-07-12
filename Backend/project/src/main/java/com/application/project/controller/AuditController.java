package com.application.project.controller;

import com.application.project.dto.ApiResponse;
import com.application.project.dto.AuditAssignmentRequest;
import com.application.project.dto.AuditCycleRequest;
import com.application.project.dto.AuditResponse;
import com.application.project.service.AuditService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/audit-cycles")
@RequiredArgsConstructor
public class AuditController {

    private final AuditService auditService;

    @PostMapping
    public ResponseEntity<ApiResponse<AuditResponse>> create(@Valid @RequestBody AuditCycleRequest request,
                                                              Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        AuditResponse response = auditService.createCycle(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, "Audit cycle created"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AuditResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(auditService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AuditResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(auditService.getById(id)));
    }

    @PostMapping("/{id}/assignments")
    public ResponseEntity<ApiResponse<AuditResponse.AssignmentResponse>> assign(
            @PathVariable Long id,
            @Valid @RequestBody AuditAssignmentRequest request,
            Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        AuditResponse.AssignmentResponse response = auditService.assignAsset(id, request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, "Asset assigned to audit"));
    }

    @PatchMapping("/assignments/{assignmentId}/finding")
    public ResponseEntity<ApiResponse<AuditResponse.AssignmentResponse>> recordFinding(
            @PathVariable Long assignmentId,
            @RequestBody Map<String, String> body,
            Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        String finding = body.get("finding");
        String notes = body.get("notes");
        return ResponseEntity.ok(ApiResponse.ok(
                auditService.recordFinding(assignmentId, finding, notes, userId)));
    }

    @PatchMapping("/{id}/close")
    public ResponseEntity<ApiResponse<AuditResponse>> close(@PathVariable Long id, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(ApiResponse.ok(auditService.closeCycle(id, userId), "Audit cycle closed"));
    }
}
