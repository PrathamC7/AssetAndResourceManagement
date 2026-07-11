package com.application.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.application.project.entity.Student;

public interface StudentRepository extends JpaRepository<Student, Integer> {
}