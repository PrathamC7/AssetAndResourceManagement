package com.application.project.repository;

import com.application.project.entity.Transfer;
import com.application.project.enums.TransferStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransferRepository extends JpaRepository<Transfer, Long> {
    List<Transfer> findByStatus(TransferStatus status);
    long countByStatus(TransferStatus status);
}
