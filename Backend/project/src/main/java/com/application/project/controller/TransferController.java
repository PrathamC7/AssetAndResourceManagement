package com.application.project.controller;

import com.application.project.dto.ApiResponse;
import com.application.project.dto.TransferRequest;
import com.application.project.dto.TransferResponse;
import com.application.project.service.TransferService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transfers")
@RequiredArgsConstructor
public class TransferController {

    private final TransferService transferService;

    @PostMapping
    public ResponseEntity<ApiResponse<TransferResponse>> create(@Valid @RequestBody TransferRequest request,
                                                                 Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        TransferResponse response = transferService.requestTransfer(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, "Transfer requested successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TransferResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(transferService.getAll()));
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<TransferResponse>> approve(@PathVariable Long id, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(ApiResponse.ok(transferService.approve(id, userId), "Transfer approved"));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<TransferResponse>> reject(@PathVariable Long id, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(ApiResponse.ok(transferService.reject(id, userId), "Transfer rejected"));
    }
}
