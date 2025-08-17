package com.example.employee_management.config;
import com.example.employee_management.entity.Employee;
import com.example.employee_management.entity.User;
import com.example.employee_management.repository.EmployeeRepository;
import com.example.employee_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create default admin user
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
            System.out.println("Default admin user created: admin/admin123");
        }

        // Create default regular user
        if (!userRepository.existsByUsername("user")) {
            User user = new User();
            user.setUsername("user");
            user.setEmail("user@example.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setFirstName("Regular");
            user.setLastName("User");
            user.setRole(User.Role.USER);
            userRepository.save(user);
            System.out.println("Default regular user created: user/user123");
        }

        // Create sample employees if none exist
        if (employeeRepository.count() == 0) {
            Employee[] sampleEmployees = {
                    new Employee("EMP001", "أحمد", "محمد", "تكنولوجيا المعلومات", "مطور برمجيات",
                            new BigDecimal("12000"), LocalDate.of(2022, 1, 15)),
                    new Employee("EMP002", "فاطمة", "علي", "الموارد البشرية", "أخصائي موارد بشرية",
                            new BigDecimal("8000"), LocalDate.of(2021, 3, 20)),
                    new Employee("EMP003", "محمد", "أحمد", "المالية", "محاسب",
                            new BigDecimal("9000"), LocalDate.of(2020, 6, 10)),
                    new Employee("EMP004", "سارة", "حسن", "التسويق", "مدير تسويق",
                            new BigDecimal("15000"), LocalDate.of(2019, 9, 5)),
                    new Employee("EMP005", "عمر", "خالد", "تكنولوجيا المعلومات", "مهندس شبكات",
                            new BigDecimal("11000"), LocalDate.of(2022, 11, 12)),
                    new Employee("EMP006", "مريم", "عبدالله", "خدمة العملاء", "ممثل خدمة عملاء",
                            new BigDecimal("6000"), LocalDate.of(2023, 2, 8)),
                    new Employee("EMP007", "يوسف", "إبراهيم", "المبيعات", "مندوب مبيعات",
                            new BigDecimal("7500"), LocalDate.of(2022, 8, 25)),
                    new Employee("EMP008", "نور", "سالم", "الإدارة", "مساعد إداري",
                            new BigDecimal("5500"), LocalDate.of(2023, 4, 18))
            };

            // Set additional properties
            for (int i = 0; i < sampleEmployees.length; i++) {
                Employee emp = sampleEmployees[i];
                emp.setEmail(emp.getFirstName().toLowerCase() + "." + emp.getLastName().toLowerCase() + "@company.com");
                emp.setPhoneNumber("010" + String.format("%08d", (i + 1) * 12345));
                emp.setStatus(Employee.EmploymentStatus.ACTIVE);
            }

            employeeRepository.saveAll(Arrays.asList(sampleEmployees));
            System.out.println("Sample employees created successfully!");
        }
    }
}