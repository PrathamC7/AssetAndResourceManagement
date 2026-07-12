package com.application.project.config;

import com.application.project.entity.Asset;
import com.application.project.entity.AssetCategory;
import com.application.project.entity.Department;
import com.application.project.entity.User;
import com.application.project.enums.LifecycleState;
import com.application.project.enums.Role;
import com.application.project.repository.AssetCategoryRepository;
import com.application.project.repository.AssetRepository;
import com.application.project.repository.DepartmentRepository;
import com.application.project.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final AssetCategoryRepository categoryRepository;
    private final AssetRepository assetRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.existsByEmail("admin@assetflow.com")) {
            log.info("Data already seeded, skipping...");
            return;
        }

        log.info("Seeding initial data...");

        // Create admin user
        User admin = userRepository.save(User.builder()
                .name("Admin User")
                .email("admin@assetflow.com")
                .passwordHash(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .isActive(true)
                .build());

        // Create departments
        Department engineering = departmentRepository.save(Department.builder()
                .name("Engineering")
                .isActive(true)
                .build());

        Department facilities = departmentRepository.save(Department.builder()
                .name("Facilities")
                .isActive(true)
                .build());

        Department fieldOps = departmentRepository.save(Department.builder()
                .name("Field Ops")
                .isActive(true)
                .build());

        // Create categories
        AssetCategory electronics = categoryRepository.save(AssetCategory.builder()
                .name("Electronics")
                .description("Electronic devices and equipment")
                .build());

        AssetCategory furniture = categoryRepository.save(AssetCategory.builder()
                .name("Furniture")
                .description("Office furniture and fixtures")
                .build());

        AssetCategory vehicles = categoryRepository.save(AssetCategory.builder()
                .name("Vehicles")
                .description("Company vehicles and transport")
                .build());

        // Create 5 sample assets
        assetRepository.save(Asset.builder()
                .assetTag("AF-0001")
                .name("MacBook Pro 16\"")
                .categoryId(electronics.getId())
                .serialNumber("MBP-2026-001")
                .acquisitionDate(LocalDate.of(2026, 1, 15))
                .cost(new BigDecimal("2499.00"))
                .conditionStatus("Excellent")
                .location("Engineering Lab")
                .isBookable(false)
                .lifecycleState(LifecycleState.AVAILABLE)
                .registeredBy(admin.getId())
                .build());

        assetRepository.save(Asset.builder()
                .assetTag("AF-0002")
                .name("Standing Desk - Uplift V2")
                .categoryId(furniture.getId())
                .serialNumber("DESK-2026-001")
                .acquisitionDate(LocalDate.of(2026, 2, 1))
                .cost(new BigDecimal("799.00"))
                .conditionStatus("Good")
                .location("Floor 3 - Bay A")
                .isBookable(false)
                .lifecycleState(LifecycleState.AVAILABLE)
                .registeredBy(admin.getId())
                .build());

        assetRepository.save(Asset.builder()
                .assetTag("AF-0003")
                .name("Conference Room Projector")
                .categoryId(electronics.getId())
                .serialNumber("PROJ-2026-001")
                .acquisitionDate(LocalDate.of(2026, 3, 10))
                .cost(new BigDecimal("1299.00"))
                .conditionStatus("Good")
                .location("Conference Room A")
                .isBookable(true)
                .lifecycleState(LifecycleState.AVAILABLE)
                .registeredBy(admin.getId())
                .build());

        assetRepository.save(Asset.builder()
                .assetTag("AF-0004")
                .name("Toyota HiAce Van")
                .categoryId(vehicles.getId())
                .serialNumber("VEH-2026-001")
                .acquisitionDate(LocalDate.of(2026, 1, 5))
                .cost(new BigDecimal("35000.00"))
                .conditionStatus("Good")
                .location("Parking Lot B")
                .isBookable(true)
                .lifecycleState(LifecycleState.AVAILABLE)
                .registeredBy(admin.getId())
                .build());

        assetRepository.save(Asset.builder()
                .assetTag("AF-0005")
                .name("Dell Monitor 27\" 4K")
                .categoryId(electronics.getId())
                .serialNumber("MON-2026-001")
                .acquisitionDate(LocalDate.of(2026, 4, 20))
                .cost(new BigDecimal("549.00"))
                .conditionStatus("New")
                .location("IT Storage")
                .isBookable(false)
                .lifecycleState(LifecycleState.AVAILABLE)
                .registeredBy(admin.getId())
                .build());

        log.info("Data seeding completed! Admin: admin@assetflow.com / admin123");
    }
}
