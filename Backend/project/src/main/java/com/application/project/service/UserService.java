package com.application.project.service;

import com.application.project.entity.Department;
import com.application.project.entity.User;
import com.application.project.enums.Role;
import com.application.project.exception.ResourceNotFoundException;
import com.application.project.repository.DepartmentRepository;
import com.application.project.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;

    public Page<User> getAll(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public User updateRole(Long id, String roleName) {
        User user = getById(id);
        user.setRole(Role.valueOf(roleName));
        return userRepository.save(user);
    }

    public User updateDepartment(Long id, Long departmentId) {
        User user = getById(id);
        Department dept = null;
        if (departmentId != null) {
            dept = departmentRepository.findById(departmentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + departmentId));
        }
        user.setDepartment(dept);
        return userRepository.save(user);
    }

    public User update(Long id, String name, Long departmentId, Boolean isActive) {
        User user = getById(id);
        if (name != null) user.setName(name);
        if (departmentId != null) {
            Department dept = departmentRepository.findById(departmentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + departmentId));
            user.setDepartment(dept);
        }
        if (isActive != null) user.setIsActive(isActive);
        return userRepository.save(user);
    }
}
