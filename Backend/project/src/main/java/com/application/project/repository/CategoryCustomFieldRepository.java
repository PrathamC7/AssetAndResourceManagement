package com.application.project.repository;

import com.application.project.entity.CategoryCustomField;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryCustomFieldRepository extends JpaRepository<CategoryCustomField, Long> {
    List<CategoryCustomField> findByCategoryId(Long categoryId);
    void deleteByCategoryId(Long categoryId);
}
