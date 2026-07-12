package com.application.project.repository;

import com.application.project.entity.AuditCycle;
import com.application.project.enums.AuditStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditCycleRepository extends JpaRepository<AuditCycle, Long> {
    List<AuditCycle> findByStatus(AuditStatus status);
    long countByStatus(AuditStatus status);
}
