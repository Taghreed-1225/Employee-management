package com.example.employee_management.controller;

import com.example.employee_management.dto.ApiResponse;
import com.example.employee_management.entity.Employee;
import com.example.employee_management.service.EmployeeService;
import com.example.employee_management.service.ExcelExportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/employees")
@Tag(name = "Employee Management", description = "Employee CRUD operations")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class EmployeeController {


    private final EmployeeService employeeService;


    private final ExcelExportService excelExportService;

    @GetMapping
    @Operation(summary = "Get all employees", description = "Retrieve all employees with optional pagination")
    public ResponseEntity<ApiResponse> getAllEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection,
            @RequestParam(required = false) String search) {

        try {
            Sort sort = sortDirection.equalsIgnoreCase("desc") ?
                    Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

            if (search != null && !search.trim().isEmpty()) {
                List<Employee> employees = employeeService.searchEmployees(search.trim());
                return ResponseEntity.ok(new ApiResponse(true, "Employees found", employees));
            } else {
                Pageable pageable = PageRequest.of(page, size, sort);
                Page<Employee> employeePage = employeeService.getAllEmployees(pageable);
                return ResponseEntity.ok(new ApiResponse(true, "Employees retrieved successfully", employeePage));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving employees: " + e.getMessage()));
        }
    }

    @GetMapping("/all")
    @Operation(summary = "Get all employees without pagination", description = "Retrieve all employees")
    public ResponseEntity<ApiResponse> getAllEmployeesNoPagination() {
        try {
            List<Employee> employees = employeeService.getAllEmployees();
            return ResponseEntity.ok(new ApiResponse(true, "Employees retrieved successfully", employees));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving employees: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get employee by ID", description = "Retrieve a specific employee by ID")
    public ResponseEntity<ApiResponse> getEmployeeById(@PathVariable Long id) {
        try {
            Optional<Employee> employee = employeeService.getEmployeeById(id);
            if (employee.isPresent()) {
                return ResponseEntity.ok(new ApiResponse(true, "Employee found", employee.get()));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving employee: " + e.getMessage()));
        }
    }

    @PostMapping
    @Operation(summary = "Create new employee", description = "Create a new employee record")
    public ResponseEntity<ApiResponse> createEmployee(@Valid @RequestBody Employee employee) {
        try {
            Employee createdEmployee = employeeService.createEmployee(employee);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "Employee created successfully", createdEmployee));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error creating employee: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update employee", description = "Update an existing employee record")
    public ResponseEntity<ApiResponse> updateEmployee(@PathVariable Long id,
                                                      @Valid @RequestBody Employee employee) {
        try {
            Employee updatedEmployee = employeeService.updateEmployee(id, employee);
            return ResponseEntity.ok(new ApiResponse(true, "Employee updated successfully", updatedEmployee));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error updating employee: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete employee", description = "Delete an employee record")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteEmployee(@PathVariable Long id) {
        try {
            employeeService.deleteEmployee(id);
            return ResponseEntity.ok(new ApiResponse(true, "Employee deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error deleting employee: " + e.getMessage()));
        }
    }

    @GetMapping("/search")
    @Operation(summary = "Search employees", description = "Search employees by various criteria")
    public ResponseEntity<ApiResponse> searchEmployees(@RequestParam String query) {
        try {
            List<Employee> employees = employeeService.searchEmployees(query);
            return ResponseEntity.ok(new ApiResponse(true, "Search completed", employees));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error searching employees: " + e.getMessage()));
        }
    }
    @GetMapping("/department/{department}")
    @Operation(summary = "Get employees by department", description = "Retrieve employees from specific department")
    public ResponseEntity<ApiResponse> getEmployeesByDepartment(@PathVariable String department) {
        try {
            List<Employee> employees = employeeService.getEmployeesByDepartment(department);
            return ResponseEntity.ok(new ApiResponse(true, "Employees retrieved", employees));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving employees: " + e.getMessage()));
        }
    }

    @GetMapping("/position/{position}")
    @Operation(summary = "Get employees by position", description = "Retrieve employees with specific position")
    public ResponseEntity<ApiResponse> getEmployeesByPosition(@PathVariable String position) {
        try {
            List<Employee> employees = employeeService.getEmployeesByPosition(position);
            return ResponseEntity.ok(new ApiResponse(true, "Employees retrieved", employees));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving employees: " + e.getMessage()));
        }
    }

    @GetMapping("/departments")
    @Operation(summary = "Get all departments", description = "Retrieve list of all departments")
    public ResponseEntity<ApiResponse> getAllDepartments() {
        try {
            List<String> departments = employeeService.getAllDepartments();
            return ResponseEntity.ok(new ApiResponse(true, "Departments retrieved", departments));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving departments: " + e.getMessage()));
        }
    }

    @GetMapping("/positions")
    @Operation(summary = "Get all positions", description = "Retrieve list of all positions")
    public ResponseEntity<ApiResponse> getAllPositions() {
        try {
            List<String> positions = employeeService.getAllPositions();
            return ResponseEntity.ok(new ApiResponse(true, "Positions retrieved", positions));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving positions: " + e.getMessage()));
        }
    }

    @GetMapping("/export/excel")
    @Operation(summary = "Export employees to Excel", description = "Export all employees data to Excel file")
    public ResponseEntity<byte[]> exportToExcel() {
        try {
            List<Employee> employees = employeeService.getAllEmployees();
            byte[] excelData = excelExportService.exportEmployeesToExcel(employees);

            String filename = "employees_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", filename);
            headers.setContentLength(excelData.length);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(excelData);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

  
}
