package com.example.employee_management.repository;
import com.example.employee_management.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmployeeCode(String employeeCode);
    List<Employee> findByDepartment(String department);
    List<Employee> findByPosition(String position);
    List<Employee> findByStatus(Employee.EmploymentStatus status);
    boolean existsByEmployeeCode(String employeeCode);
    boolean existsByEmail(String email);

    @Query("SELECT e FROM Employee e WHERE " +
            "LOWER(e.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(e.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(e.employeeCode) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(e.department) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(e.position) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Employee> searchEmployees(@Param("searchTerm") String searchTerm);

    @Query("SELECT DISTINCT e.department FROM Employee e ORDER BY e.department")
    List<String> findAllDepartments();

    @Query("SELECT DISTINCT e.position FROM Employee e ORDER BY e.position")
    List<String> findAllPositions();

    @Query("SELECT COUNT(e) FROM Employee e WHERE e.status = :status")
    long countByStatus(@Param("status") Employee.EmploymentStatus status);
}