package com.application.project.service;

import com.application.project.dto.CategoryRequest;
import com.application.project.dto.CategoryResponse;
import com.application.project.entity.AssetCategory;
import com.application.project.entity.CategoryCustomField;
import com.application.project.exception.ConflictException;
import com.application.project.exception.ResourceNotFoundException;
import com.application.project.repository.AssetCategoryRepository;
import com.application.project.repository.CategoryCustomFieldRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final AssetCategoryRepository categoryRepository;
    private final CategoryCustomFieldRepository customFieldRepository;

    @Transactional
    public CategoryResponse create(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new ConflictException("Category name already exists");
        }

        AssetCategory category = AssetCategory.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
        category = categoryRepository.save(category);

        List<CategoryCustomField> fields = saveCustomFields(category.getId(), request.getCustomFields());
        return toResponse(category, fields);
    }

    public List<CategoryResponse> getAll() {
        return categoryRepository.findAll().stream()
                .map(cat -> toResponse(cat, customFieldRepository.findByCategoryId(cat.getId())))
                .collect(Collectors.toList());
    }

    public CategoryResponse getById(Long id) {
        AssetCategory cat = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        List<CategoryCustomField> fields = customFieldRepository.findByCategoryId(id);
        return toResponse(cat, fields);
    }

    @Transactional
    public CategoryResponse update(Long id, CategoryRequest request) {
        AssetCategory cat = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        if (!cat.getName().equals(request.getName()) && categoryRepository.existsByName(request.getName())) {
            throw new ConflictException("Category name already exists");
        }

        cat.setName(request.getName());
        cat.setDescription(request.getDescription());
        cat = categoryRepository.save(cat);

        customFieldRepository.deleteByCategoryId(id);
        List<CategoryCustomField> fields = saveCustomFields(id, request.getCustomFields());

        return toResponse(cat, fields);
    }

    private List<CategoryCustomField> saveCustomFields(Long categoryId, List<CategoryRequest.CustomFieldDto> dtos) {
        if (dtos == null || dtos.isEmpty()) return new ArrayList<>();

        List<CategoryCustomField> fields = dtos.stream()
                .map(dto -> CategoryCustomField.builder()
                        .categoryId(categoryId)
                        .fieldName(dto.getFieldName())
                        .fieldType(dto.getFieldType())
                        .isRequired(dto.getIsRequired() != null ? dto.getIsRequired() : false)
                        .options(dto.getOptions())
                        .displayOrder(dto.getDisplayOrder() != null ? dto.getDisplayOrder() : 0)
                        .build())
                .collect(Collectors.toList());

        return customFieldRepository.saveAll(fields);
    }

    private CategoryResponse toResponse(AssetCategory cat, List<CategoryCustomField> fields) {
        List<CategoryResponse.CustomFieldResponse> fieldResponses = fields.stream()
                .map(f -> CategoryResponse.CustomFieldResponse.builder()
                        .id(f.getId())
                        .fieldName(f.getFieldName())
                        .fieldType(f.getFieldType())
                        .isRequired(f.getIsRequired())
                        .options(f.getOptions())
                        .displayOrder(f.getDisplayOrder())
                        .build())
                .collect(Collectors.toList());

        return CategoryResponse.builder()
                .id(cat.getId())
                .name(cat.getName())
                .description(cat.getDescription())
                .customFields(fieldResponses)
                .createdAt(cat.getCreatedAt())
                .updatedAt(cat.getUpdatedAt())
                .build();
    }
}
