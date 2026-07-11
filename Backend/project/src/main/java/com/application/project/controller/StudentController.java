package com.application.project.controller;

import org.springframework.web.bind.annotation.*;

import com.application.project.entity.Student;
import com.application.project.repository.StudentRepository;

import java.util.List;

@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentRepository repository;

    public StudentController(StudentRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public Student saveStudent() {
        Student student = new Student("Pratham", "Java");
        return repository.save(student);
    }

    @GetMapping
    public List<Student> getStudents() {
        return repository.findAll();
    }
}