package com.application.project.controller;

import com.application.project.dto.ApiResponse;
import com.application.project.dto.BookingRequest;
import com.application.project.dto.BookingResponse;
import com.application.project.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> create(@Valid @RequestBody BookingRequest request,
                                                                Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        BookingResponse response = bookingService.create(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, "Booking created successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAll(
            @RequestParam(required = false) Long assetId) {
        if (assetId != null) {
            return ResponseEntity.ok(ApiResponse.ok(bookingService.getByAsset(assetId)));
        }
        return ResponseEntity.ok(ApiResponse.ok(bookingService.getAll()));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> cancel(@PathVariable Long id, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(ApiResponse.ok(bookingService.cancel(id, userId), "Booking cancelled"));
    }
}
