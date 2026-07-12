package com.application.project.controller;

import com.application.project.dto.ApiResponse;
import com.application.project.entity.User;
import com.application.project.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<User>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(userService.getAll(PageRequest.of(page, size))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(userService.getById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        String name = body.containsKey("name") ? (String) body.get("name") : null;
        Long departmentId = body.containsKey("departmentId") ? Long.valueOf(body.get("departmentId").toString()) : null;
        Boolean isActive = body.containsKey("isActive") ? (Boolean) body.get("isActive") : null;
        return ResponseEntity.ok(ApiResponse.ok(userService.update(id, name, departmentId, isActive)));
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<ApiResponse<User>> updateRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String role = body.get("role");
        return ResponseEntity.ok(ApiResponse.ok(userService.updateRole(id, role), "Role updated successfully"));
    }
}
