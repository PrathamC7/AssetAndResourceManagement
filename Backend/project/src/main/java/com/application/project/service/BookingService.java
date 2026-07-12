package com.application.project.service;

import com.application.project.dto.BookingRequest;
import com.application.project.dto.BookingResponse;
import com.application.project.entity.Asset;
import com.application.project.entity.ResourceBooking;
import com.application.project.entity.User;
import com.application.project.enums.BookingStatus;
import com.application.project.exception.ConflictException;
import com.application.project.exception.ResourceNotFoundException;
import com.application.project.repository.AssetRepository;
import com.application.project.repository.ResourceBookingRepository;
import com.application.project.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final ResourceBookingRepository bookingRepository;
    private final AssetRepository assetRepository;
    private final UserRepository userRepository;

    @Transactional
    public BookingResponse create(BookingRequest request, Long userId) {
        Asset asset = assetRepository.findById(request.getAssetId())
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found"));

        if (!asset.getIsBookable()) {
            throw new ConflictException("Asset is not bookable");
        }

        if (request.getEndTime().isBefore(request.getStartTime()) || request.getEndTime().isEqual(request.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time");
        }

        List<ResourceBooking> overlapping = bookingRepository.findOverlapping(
                request.getAssetId(), request.getStartTime(), request.getEndTime());

        if (!overlapping.isEmpty()) {
            throw new ConflictException("Booking overlaps with an existing booking");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ResourceBooking booking = ResourceBooking.builder()
                .asset(asset)
                .bookedBy(user)
                .title(request.getTitle())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .status(BookingStatus.UPCOMING)
                .notes(request.getNotes())
                .build();

        booking = bookingRepository.save(booking);
        return toResponse(booking);
    }

    @Transactional
    public BookingResponse cancel(Long bookingId, Long userId) {
        ResourceBooking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (booking.getStatus() != BookingStatus.UPCOMING) {
            throw new ConflictException("Only upcoming bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
        return toResponse(booking);
    }

    public List<BookingResponse> getByAsset(Long assetId) {
        return bookingRepository.findByAssetIdAndStatusIn(assetId,
                        List.of(BookingStatus.UPCOMING, BookingStatus.ONGOING))
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getAll() {
        return bookingRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private BookingResponse toResponse(ResourceBooking booking) {
        String assetName = booking.getAsset() != null ? booking.getAsset().getName() : "Unknown";
        String userName = booking.getBookedBy() != null ? booking.getBookedBy().getName() : "Unknown";

        return BookingResponse.builder()
                .id(booking.getId())
                .assetId(booking.getAsset() != null ? booking.getAsset().getId() : null)
                .assetName(assetName)
                .bookedBy(booking.getBookedBy() != null ? booking.getBookedBy().getId() : null)
                .bookedByName(userName)
                .title(booking.getTitle())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .status(booking.getStatus().name())
                .notes(booking.getNotes())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
