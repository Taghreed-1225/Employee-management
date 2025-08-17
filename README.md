# Employee Management System

A comprehensive Spring Boot application for managing employees with authentication, authorization, and Excel export capabilities.

## Features

### 🔐 Authentication & Authorization
- User registration and login
- JWT token-based authentication
- Password hashing using BCrypt
- Role-based access control (USER, ADMIN)

### 👥 Employee Management
- Complete CRUD operations for employees
- Search employees by name, code, department, or position
- Filter employees by department, position, and status
- Pagination and sorting support
- Employee statistics and reporting

### 📊 Excel Export
- Export all employees data to Excel (.xlsx) format
- Formatted Excel with headers and styling
- Download functionality with timestamp

### 📚 API Documentation
- Swagger/OpenAPI documentation
- Interactive API testing interface
- Complete API endpoints documentation

## Technologies Used

- **Spring Boot 3.2.1**
- **Spring Security** - Authentication & Authorization
- **Spring Data JPA** - Database operations
- **H2 Database** - In-memory database for development
- **JWT (JSON Web Tokens)** - Authentication tokens
- **Apache POI** - Excel file generation
- **Swagger/OpenAPI** - API documentation
- **Maven** - Dependency management

## Requirements

- Java 17+
- Maven 3.6+

## How to Run

### 1. Clone the repository
```bash
git clone <repository-url>
cd employee-management
```

### 2. Build the project
```bash
mvn clean install
```

### 3. Run the application
```bash
mvn spring-boot:run
```

Or run the JAR file:
```bash
java -jar target/employee-management-0.0.1-SNAPSHOT.jar
```

### 4. Access the application

- **Application**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **H2 Console**: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:testdb`
  - Username: `sa`
  - Password: (empty)

## Default Accounts

The application automatically creates default accounts on startup:

### Admin Account 🔑
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: ADMIN
- **Permissions**: Full access to all features including employee deletion

### Regular User Account 👤
- **Username**: `user`
- **Password**: `user123`
- **Role**: USER
- **Permissions**: Can view, create, and update employees (cannot delete)

### Sample Employees
The system also creates 8 sample employees with Arabic names for testing purposes.

## API Endpoints

### 🔐 Authentication APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/test` | Test API connectivity |

### 👥 Employee APIs

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/api/employees` | Get all employees (paginated) | ✅ | ❌ |
| GET | `/api/employees/all` | Get all employees | ✅ | ❌ |
| GET | `/api/employees/{id}` | Get employee by ID | ✅ | ❌ |
| POST | `/api/employees` | Create new employee | ✅ | ❌ |
| PUT | `/api/employees/{id}` | Update employee | ✅ | ❌ |
| DELETE | `/api/employees/{id}` | Delete employee | ✅ | ✅ |
| GET | `/api/employees/search` | Search employees | ✅ | ❌ |
| GET | `/api/employees/department/{dept}` | Get by department | ✅ | ❌ |
| GET | `/api/employees/position/{pos}` | Get by position | ✅ | ❌ |
| GET | `/api/employees/departments` | Get all departments | ✅ | ❌ |
| GET | `/api/employees/positions` | Get all positions | ✅ | ❌ |
| GET | `/api/employees/export/excel` | Export to Excel | ✅ | ❌ |

## Usage Examples

### 1. Register New User
```bash
curl -X POST "http://localhost:8080/api/auth/register" \
     -H "Content-Type: application/json" \
     -d '{
       "username": "newuser",
       "email": "newuser@example.com",
       "password": "password123",
       "firstName": "New",
       "lastName": "User"
     }'
```

### 2. Login (Admin)
```bash
curl -X POST "http://localhost:8080/api/auth/login" \
     -H "Content-Type: application/json" \
     -d '{
       "username": "admin",
       "password": "admin123"
     }'
```

### 3. Login (Regular User)
```bash
curl -X POST "http://localhost:8080/api/auth/login" \
     -H "Content-Type: application/json" \
     -d '{
       "username": "user",
       "password": "user123"
     }'
```

### 4. Create New Employee
```bash
curl -X POST "http://localhost:8080/api/employees" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{
       "employeeCode": "EMP009",
       "firstName": "Ahmed",
       "lastName": "Mohamed", 
       "email": "ahmed@company.com",
       "phoneNumber": "01012345678",
       "department": "Information Technology",
       "position": "Web Developer",
       "salary": 10000,
       "hireDate": "2024-01-01",
       "status": "ACTIVE"
     }'
```

### 5. Export to Excel
```bash
curl -X GET "http://localhost:8080/api/employees/export/excel" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -o employees.xlsx
```

## Data Structure

### User Entity
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "firstName": "Admin",
  "lastName": "User",
  "role": "ADMIN",
  "isEnabled": true,
  "createdAt": "2024-01-01T10:00:00",
  "updatedAt": "2024-01-01T10:00:00"
}
```

### Employee Entity
```json
{
  "id": 1,
  "employeeCode": "EMP001",
  "firstName": "Ahmed",
  "lastName": "Mohamed",
  "email": "ahmed@company.com",
  "phoneNumber": "01012345678",
  "department": "Information Technology",
  "position": "Software Developer",
  "salary": 12000.00,
  "hireDate": "2022-01-15",
  "status": "ACTIVE",
  "managerId": null,
  "createdAt": "2024-01-01T10:00:00",
  "updatedAt": "2024-01-01T10:00:00"
}
```

## API Response Format

All API responses follow this standard format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

## Security

- All passwords are protected using BCrypt hashing
- JWT tokens with 24-hour expiration
- Role-based authorization for different resources
- CORS configuration for frontend integration
- Only ADMIN users can delete employees



By modifying `application.yml` and adding the appropriate driver in `pom.xml`.

## Testing the Application

1. **Start the application**
2. **Login with default accounts:**
   - Admin: `admin/admin123` (full access)
   - User: `user/user123` (limited access)
3. **Use Swagger UI** at http://localhost:8080/swagger-ui.html for interactive testing
4. **Test employee operations** with the pre-loaded sample data

## Frontend Integration

The backend is configured to work with:
- **Angular Frontend** (CORS enabled for http://localhost:4200)
- **React/Vue.js** applications
- **Mobile applications**

## Future Enhancements

- [ ] Frontend web application (React/Angular/Vue)
- [ ] Mobile application
- [ ] Email notifications
- [ ] File upload for employee photos
- [ ] Advanced reporting and analytics
- [ ] Integration with payroll systems
- [ ] Multi-language support
- [ ] Advanced search and filtering

## Contributing

Feel free to contribute to this project by:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Troubleshooting

### Common Issues

1. **Port 8080 already in use**: Change the port in `application.yml`
2. **JWT Token expired**: Login again to get a new token
3. **Access denied**: Make sure you're using the correct role for the operation
4. **Database connection issues**: Check H2 console configuration

### Support

For support or questions, please create an issue in the repository.
