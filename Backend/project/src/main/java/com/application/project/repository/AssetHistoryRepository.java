package com.application.project.repository;

import com.application.project.entity.AssetHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssetHistoryRepository extends JpaRepository<AssetHistory, Long> {
    Page<AssetHistory> findByAssetIdOrderByCreatedAtDesc(Long assetId, Pageable pageable);
}
