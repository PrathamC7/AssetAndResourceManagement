package com.application.project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class CategoryRequest {
    @NotBlank(message = "Category name is required")
    private String name;
    private String description;
    private List<CustomFieldDto> customFields;

    @Data
    public static class CustomFieldDto {
        private String fieldName;
        private String fieldType;
        private Boolean isRequired;
        private String options;
        private Integer displayOrder;
    }
}
