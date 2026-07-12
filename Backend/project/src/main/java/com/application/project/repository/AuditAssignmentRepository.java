package com.application.project.repository;

import com.application.project.entity.AuditAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditAssignmentRepository extends JpaRepository<AuditAssignment, Long> {
    List<AuditAssignment> findByCycleId(Long cycleId);
}
