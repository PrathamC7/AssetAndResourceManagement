package com.application.project.service;

import com.application.project.dto.DepartmentRequest;
import com.application.project.dto.DepartmentResponse;
import com.application.project.entity.Department;
import com.application.project.entity.User;
import com.application.project.exception.ConflictException;
import com.application.project.exception.ResourceNotFoundException;
import com.application.project.repository.DepartmentRepository;
import com.application.project.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    public DepartmentResponse create(DepartmentRequest request) {
        if (departmentRepository.existsByName(request.getName())) {
            throw new ConflictException("Department name already exists");
        }

        Department parent = null;
        if (request.getParentId() != null) {
            parent = departmentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent department not found"));
        }

        User head = null;
        if (request.getHeadId() != null) {
            head = userRepository.findById(request.getHeadId())
                    .orElseThrow(() -> new ResourceNotFoundException("Head user not found"));
        }

        Department dept = Department.builder()
                .name(request.getName())
                .parentDepartment(parent)
                .head(head)
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
        
        if (request.getParentId() != null) {
            Department parent = departmentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent department not found"));
            dept.setParentDepartment(parent);
        } else {
            dept.setParentDepartment(null);
        }

        if (request.getHeadId() != null) {
            User head = userRepository.findById(request.getHeadId())
                    .orElseThrow(() -> new ResourceNotFoundException("Head user not found"));
            dept.setHead(head);
        } else {
            dept.setHead(null);
        }

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
                .parentId(dept.getParentDepartment() != null ? dept.getParentDepartment().getId() : null)
                .headId(dept.getHead() != null ? dept.getHead().getId() : null)
                .isActive(dept.getIsActive())
                .createdAt(dept.getCreatedAt())
                .updatedAt(dept.getUpdatedAt())
                .build();
    }
}
