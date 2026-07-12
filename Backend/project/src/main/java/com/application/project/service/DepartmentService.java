package com.application.project.service;

import com.application.project.dto.DepartmentRequest;
import com.application.project.dto.DepartmentResponse;
import com.application.project.entity.Department;
import com.application.project.exception.ConflictException;
import com.application.project.exception.ResourceNotFoundException;
import com.application.project.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentResponse create(DepartmentRequest request) {
        if (departmentRepository.existsByName(request.getName())) {
            throw new ConflictException("Department name already exists");
        }

        Department dept = Department.builder()
                .name(request.getName())
                .parentId(request.getParentId())
                .headId(request.getHeadId())
                .isActive(true)
                .build();

        dept = departmentRepository.save(dept);
        return toResponse(dept);
    }

    public List<DepartmentResponse> getAll() {
        return departmentRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public DepartmentResponse getById(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        return toResponse(dept);
    }

    public DepartmentResponse update(Long id, DepartmentRequest request) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));

        if (!dept.getName().equals(request.getName()) && departmentRepository.existsByName(request.getName())) {
            throw new ConflictException("Department name already exists");
        }

        dept.setName(request.getName());
        dept.setParentId(request.getParentId());
        dept.setHeadId(request.getHeadId());

        dept = departmentRepository.save(dept);
        return toResponse(dept);
    }

    public DepartmentResponse deactivate(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        dept.setIsActive(false);
        dept = departmentRepository.save(dept);
        return toResponse(dept);
    }

    private DepartmentResponse toResponse(Department dept) {
        return DepartmentResponse.builder()
                .id(dept.getId())
                .name(dept.getName())
                .parentId(dept.getParentId())
                .headId(dept.getHeadId())
                .isActive(dept.getIsActive())
                .createdAt(dept.getCreatedAt())
                .updatedAt(dept.getUpdatedAt())
                .build();
    }
}
