package com.application.project.controller;

import com.application.project.dto.ApiResponse;
import com.application.project.dto.MaintenanceRequestDto;
import com.application.project.dto.MaintenanceResponse;
import com.application.project.service.MaintenanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/maintenance-requests")
@RequiredArgsConstructor
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @PostMapping
    public ResponseEntity<ApiResponse<MaintenanceResponse>> create(@Valid @RequestBody MaintenanceRequestDto request,
                                                                    Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        MaintenanceResponse response = maintenanceService.create(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, "Maintenance request created"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MaintenanceResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(maintenanceService.getAll()));
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<MaintenanceResponse>> approve(@PathVariable Long id, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(ApiResponse.ok(maintenanceService.approve(id, userId), "Maintenance request approved"));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<MaintenanceResponse>> reject(@PathVariable Long id, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(ApiResponse.ok(maintenanceService.reject(id, userId), "Maintenance request rejected"));
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<MaintenanceResponse>> assign(@PathVariable Long id,
                                                                    @RequestBody Map<String, Long> body,
                                                                    Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        Long technicianId = body.get("assignedTo");
        return ResponseEntity.ok(ApiResponse.ok(
                maintenanceService.assignTechnician(id, technicianId, userId), "Technician assigned"));
    }

    @PatchMapping("/{id}/start")
    public ResponseEntity<ApiResponse<MaintenanceResponse>> start(@PathVariable Long id, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(ApiResponse.ok(maintenanceService.start(id, userId), "Maintenance started"));
    }

    @PatchMapping("/{id}/resolve")
    public ResponseEntity<ApiResponse<MaintenanceResponse>> resolve(@PathVariable Long id,
                                                                     @RequestBody Map<String, String> body,
                                                                     Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        String notes = body.get("resolutionNotes");
        return ResponseEntity.ok(ApiResponse.ok(
                maintenanceService.resolve(id, notes, userId), "Maintenance resolved"));
    }
}
