package com.example.employee_management.service;

import com.example.employee_management.entity.Employee;
import com.example.employee_management.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Page<Employee> getAllEmployees(Pageable pageable) {
        return employeeRepository.findAll(pageable);
    }

    public Optional<Employee> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }

    public Optional<Employee> getEmployeeByCode(String employeeCode) {
        return employeeRepository.findByEmployeeCode(employeeCode);
    }

    public Employee createEmployee(Employee employee) {
        if (employeeRepository.existsByEmployeeCode(employee.getEmployeeCode())) {
            throw new RuntimeException("Employee code already exists: " + employee.getEmployeeCode());
        }

        if (employee.getEmail() != null && employeeRepository.existsByEmail(employee.getEmail())) {
            throw new RuntimeException("Email already exists: " + employee.getEmail());
        }

        return employeeRepository.save(employee);
    }

    public Employee updateEmployee(Long id, Employee employeeDetails) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));

        // Check if employee code is being changed and if it already exists
        if (!employee.getEmployeeCode().equals(employeeDetails.getEmployeeCode()) &&
                employeeRepository.existsByEmployeeCode(employeeDetails.getEmployeeCode())) {
            throw new RuntimeException("Employee code already exists: " + employeeDetails.getEmployeeCode());
        }

        // Check if email is being changed and if it already exists
        if (employeeDetails.getEmail() != null &&
                !employeeDetails.getEmail().equals(employee.getEmail()) &&
                employeeRepository.existsByEmail(employeeDetails.getEmail())) {
            throw new RuntimeException("Email already exists: " + employeeDetails.getEmail());
        }

        // Update employee details
        employee.setEmployeeCode(employeeDetails.getEmployeeCode());
        employee.setFirstName(employeeDetails.getFirstName());
        employee.setLastName(employeeDetails.getLastName());
        employee.setEmail(employeeDetails.getEmail());
        employee.setPhoneNumber(employeeDetails.getPhoneNumber());
        employee.setDepartment(employeeDetails.getDepartment());
        employee.setPosition(employeeDetails.getPosition());
        employee.setSalary(employeeDetails.getSalary());
        employee.setHireDate(employeeDetails.getHireDate());
        employee.setStatus(employeeDetails.getStatus());
        employee.setManagerId(employeeDetails.getManagerId());

        return employeeRepository.save(employee);
    }

    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new RuntimeException("Employee not found with id: " + id);
        }
        employeeRepository.deleteById(id);
    }

    public List<Employee> searchEmployees(String searchTerm) {
        return employeeRepository.searchEmployees(searchTerm);
    }

    public List<Employee> getEmployeesByDepartment(String department) {
        return employeeRepository.findByDepartment(department);
    }

    public List<Employee> getEmployeesByPosition(String position) {
        return employeeRepository.findByPosition(position);
    }

    public List<Employee> getEmployeesByStatus(Employee.EmploymentStatus status) {
        return employeeRepository.findByStatus(status);
    }

    public List<String> getAllDepartments() {
        return employeeRepository.findAllDepartments();
    }

    public List<String> getAllPositions() {
        return employeeRepository.findAllPositions();
    }

    public long getEmployeeCountByStatus(Employee.EmploymentStatus status) {
        return employeeRepository.countByStatus(status);
    }
}
