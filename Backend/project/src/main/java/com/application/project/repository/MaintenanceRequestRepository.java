package com.application.project.repository;

import com.application.project.entity.MaintenanceRequest;
import com.application.project.enums.MaintenanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {
    List<MaintenanceRequest> findByStatus(MaintenanceStatus status);
    long countByStatusAndCreatedAtBetween(MaintenanceStatus status, LocalDateTime start, LocalDateTime end);
    long countByStatus(MaintenanceStatus status);
}
