package com.application.project.repository;

import com.application.project.entity.Asset;
import com.application.project.enums.LifecycleState;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {
    List<Asset> findByLifecycleState(LifecycleState state);
    List<Asset> findByIsBookable(Boolean isBookable);
    Optional<Asset> findTopByOrderByIdDesc();
    boolean existsBySerialNumber(String serialNumber);
    boolean existsByAssetTag(String assetTag);

    @Query("SELECT a FROM Asset a WHERE " +
           "(:search IS NULL OR a.name LIKE %:search% OR a.assetTag LIKE %:search%) AND " +
           "(:state IS NULL OR a.lifecycleState = :state) AND " +
           "(:categoryId IS NULL OR a.category.id = :categoryId)")
    Page<Asset> findFiltered(@Param("search") String search,
                             @Param("state") LifecycleState state,
                             @Param("categoryId") Long categoryId,
                             Pageable pageable);

    long countByLifecycleState(LifecycleState state);
}
