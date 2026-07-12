package com.application.project.repository;

import com.application.project.entity.ResourceBooking;
import com.application.project.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ResourceBookingRepository extends JpaRepository<ResourceBooking, Long> {

    @Query("SELECT b FROM ResourceBooking b WHERE b.assetId = :assetId " +
           "AND b.status IN ('UPCOMING', 'ONGOING') " +
           "AND b.startTime < :endTime AND b.endTime > :startTime")
    List<ResourceBooking> findOverlapping(@Param("assetId") Long assetId,
                                          @Param("startTime") LocalDateTime startTime,
                                          @Param("endTime") LocalDateTime endTime);

    List<ResourceBooking> findByAssetIdAndStatusIn(Long assetId, List<BookingStatus> statuses);
    List<ResourceBooking> findByBookedBy(Long userId);
    long countByStatus(BookingStatus status);
}
