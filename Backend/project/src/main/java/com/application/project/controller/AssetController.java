package com.application.project.controller;

import com.application.project.dto.ApiResponse;
import com.application.project.dto.AssetRegistrationRequest;
import com.application.project.dto.AssetResponse;
import com.application.project.enums.LifecycleState;
import com.application.project.service.AssetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/assets")
@RequiredArgsConstructor
public class AssetController {

    private final AssetService assetService;

    @PostMapping
    public ResponseEntity<ApiResponse<AssetResponse>> register(@Valid @RequestBody AssetRegistrationRequest request,
                                                                Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        AssetResponse response = assetService.register(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, "Asset registered successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<AssetResponse>>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        LifecycleState lifecycleState = state != null ? LifecycleState.valueOf(state.toUpperCase()) : null;
        Page<AssetResponse> assets = assetService.getAll(search, lifecycleState, categoryId, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.ok(assets));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AssetResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(assetService.getById(id)));
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<ApiResponse<Page<com.application.project.dto.AssetHistoryResponse>>> getHistory(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<com.application.project.dto.AssetHistoryResponse> history = assetService.getHistory(id, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.ok(history));
    }
}
