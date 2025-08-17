package com.example.employee_management.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
@Data
@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Employee code is required")
    @Column(name = "employee_code", unique = true, nullable = false)
    private String employeeCode;

    @NotBlank(message = "First name is required")
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Email(message = "Please provide a valid email")
    @Column(unique = true)
    private String email;

    @Column(name = "phone_number")
    private String phoneNumber;

    @NotBlank(message = "Department is required")
    @Column(nullable = false)
    private String department;

    @NotBlank(message = "Position is required")
    @Column(nullable = false)
    private String position;

    @NotNull(message = "Salary is required")
    @Positive(message = "Salary must be positive")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal salary;

    @NotNull(message = "Hire date is required")
    @Column(name = "hire_date", nullable = false)
    private LocalDate hireDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EmploymentStatus status = EmploymentStatus.ACTIVE;

    @Column(name = "manager_id")
    private Long managerId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum EmploymentStatus {
        ACTIVE, INACTIVE, TERMINATED, ON_LEAVE
    }

    // Constructors
    public Employee() {}

    public Employee(String employeeCode, String firstName, String lastName, String department,
                    String position, BigDecimal salary, LocalDate hireDate) {
        this.employeeCode = employeeCode;
        this.firstName = firstName;
        this.lastName = lastName;
        this.department = department;
        this.position = position;
        this.salary = salary;
        this.hireDate = hireDate;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Helper method to get full name
    public String getFullName() {
        return firstName + " " + lastName;
    }

}
