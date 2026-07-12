package com.application.project.controller;

import com.application.project.dto.AllocationRequest;
import com.application.project.dto.AllocationResponse;
import com.application.project.dto.ApiResponse;
import com.application.project.dto.ReturnRequest;
import com.application.project.service.AllocationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/allocations")
@RequiredArgsConstructor
public class AllocationController {

    private final AllocationService allocationService;

    @PostMapping
    public ResponseEntity<ApiResponse<AllocationResponse>> allocate(@Valid @RequestBody AllocationRequest request,
                                                                     Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        AllocationResponse response = allocationService.allocate(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, "Asset allocated successfully"));
    }

    @PostMapping("/{id}/return")
    public ResponseEntity<ApiResponse<AllocationResponse>> returnAsset(@PathVariable Long id,
                                                                        @RequestBody ReturnRequest request,
                                                                        Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        AllocationResponse response = allocationService.returnAsset(id, request, userId);
        return ResponseEntity.ok(ApiResponse.ok(response, "Asset returned successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AllocationResponse>>> getActive() {
        return ResponseEntity.ok(ApiResponse.ok(allocationService.getActiveAllocations()));
    }
}
