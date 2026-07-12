package com.application.project.repository;

import com.application.project.entity.Allocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AllocationRepository extends JpaRepository<Allocation, Long> {
    Optional<Allocation> findByAssetIdAndIsActive(Long assetId, Boolean isActive);
    List<Allocation> findByAssignedToAndIsActive(Long assignedTo, Boolean isActive);
    long countByIsOverdueTrue();
    long countByIsActiveTrue();
}
