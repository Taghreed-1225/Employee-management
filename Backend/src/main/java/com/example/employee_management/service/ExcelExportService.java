package com.example.employee_management.service;

import com.example.employee_management.entity.Employee;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ExcelExportService {

    public byte[] exportEmployeesToExcel(List<Employee> employees) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Employees");

        // Create header style
        CellStyle headerStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerFont.setColor(IndexedColors.WHITE.getIndex());
        headerStyle.setFont(headerFont);
        headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        headerStyle.setBorderBottom(BorderStyle.THIN);
        headerStyle.setBorderTop(BorderStyle.THIN);
        headerStyle.setBorderRight(BorderStyle.THIN);
        headerStyle.setBorderLeft(BorderStyle.THIN);

        // Create data style
        CellStyle dataStyle = workbook.createCellStyle();
        dataStyle.setBorderBottom(BorderStyle.THIN);
        dataStyle.setBorderTop(BorderStyle.THIN);
        dataStyle.setBorderRight(BorderStyle.THIN);
        dataStyle.setBorderLeft(BorderStyle.THIN);

        // Create date style
        CellStyle dateStyle = workbook.createCellStyle();
        dateStyle.setBorderBottom(BorderStyle.THIN);
        dateStyle.setBorderTop(BorderStyle.THIN);
        dateStyle.setBorderRight(BorderStyle.THIN);
        dateStyle.setBorderLeft(BorderStyle.THIN);
        CreationHelper createHelper = workbook.getCreationHelper();
        dateStyle.setDataFormat(createHelper.createDataFormat().getFormat("yyyy-mm-dd"));

        // Create currency style for salary
        CellStyle currencyStyle = workbook.createCellStyle();
        currencyStyle.setBorderBottom(BorderStyle.THIN);
        currencyStyle.setBorderTop(BorderStyle.THIN);
        currencyStyle.setBorderRight(BorderStyle.THIN);
        currencyStyle.setBorderLeft(BorderStyle.THIN);
        currencyStyle.setDataFormat(createHelper.createDataFormat().getFormat("#,##0.00"));

        // Create header row
        Row headerRow = sheet.createRow(0);
        String[] headers = {
                "ID", "Employee Code", "First Name", "Last Name", "Full Name",
                "Email", "Phone", "Department", "Position", "Salary",
                "Hire Date", "Status", "Manager ID", "Created At"
        };

        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // Create data rows
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        int rowNum = 1;
        for (Employee employee : employees) {
            Row row = sheet.createRow(rowNum++);

            // ID
            Cell cell0 = row.createCell(0);
            if (employee.getId() != null) {
                cell0.setCellValue(employee.getId());
            }
            cell0.setCellStyle(dataStyle);

            // Employee Code
            Cell cell1 = row.createCell(1);
            cell1.setCellValue(employee.getEmployeeCode() != null ? employee.getEmployeeCode() : "");
            cell1.setCellStyle(dataStyle);

            // First Name
            Cell cell2 = row.createCell(2);
            cell2.setCellValue(employee.getFirstName() != null ? employee.getFirstName() : "");
            cell2.setCellStyle(dataStyle);

            // Last Name
            Cell cell3 = row.createCell(3);
            cell3.setCellValue(employee.getLastName() != null ? employee.getLastName() : "");
            cell3.setCellStyle(dataStyle);

            // Full Name
            Cell cell4 = row.createCell(4);
            cell4.setCellValue(employee.getFullName() != null ? employee.getFullName() : "");
            cell4.setCellStyle(dataStyle);

            // Email
            Cell cell5 = row.createCell(5);
            cell5.setCellValue(employee.getEmail() != null ? employee.getEmail() : "");
            cell5.setCellStyle(dataStyle);

            // Phone Number
            Cell cell6 = row.createCell(6);
            cell6.setCellValue(employee.getPhoneNumber() != null ? employee.getPhoneNumber() : "");
            cell6.setCellStyle(dataStyle);

            // Department
            Cell cell7 = row.createCell(7);
            cell7.setCellValue(employee.getDepartment() != null ? employee.getDepartment() : "");
            cell7.setCellStyle(dataStyle);

            // Position
            Cell cell8 = row.createCell(8);
            cell8.setCellValue(employee.getPosition() != null ? employee.getPosition() : "");
            cell8.setCellStyle(dataStyle);

            // Salary
            Cell cell9 = row.createCell(9);
            if (employee.getSalary() != null) {
                cell9.setCellValue(employee.getSalary().doubleValue());
                cell9.setCellStyle(currencyStyle);
            } else {
                cell9.setCellValue("");
                cell9.setCellStyle(dataStyle);
            }

            // Hire Date
            Cell cell10 = row.createCell(10);
            if (employee.getHireDate() != null) {
                cell10.setCellValue(employee.getHireDate().format(dateFormatter));
            } else {
                cell10.setCellValue("");
            }
            cell10.setCellStyle(dataStyle);

            // Status
            Cell cell11 = row.createCell(11);
            cell11.setCellValue(employee.getStatus() != null ? employee.getStatus().name() : "");
            cell11.setCellStyle(dataStyle);

            // Manager ID - الإصلاح الرئيسي هنا
            Cell cell12 = row.createCell(12);
            if (employee.getManagerId() != null) {
                cell12.setCellValue(employee.getManagerId().toString());
            } else {
                cell12.setCellValue("");
            }
            cell12.setCellStyle(dataStyle);

            // Created At
            Cell cell13 = row.createCell(13);
            if (employee.getCreatedAt() != null) {
                cell13.setCellValue(employee.getCreatedAt().format(dateTimeFormatter));
            } else {
                cell13.setCellValue("");
            }
            cell13.setCellStyle(dataStyle);
        }

        // Auto-size columns
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
            // Set minimum column width
            if (sheet.getColumnWidth(i) < 2000) {
                sheet.setColumnWidth(i, 2000);
            }
        }

        // Write workbook to byte array
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try {
            workbook.write(outputStream);
            return outputStream.toByteArray();
        } finally {
            // Ensure resources are properly closed
            outputStream.close();
            workbook.close();
        }
    }

    /**
     * Helper method to safely convert Long to String
     */
    private String longToString(Long value) {
        return value != null ? value.toString() : "";
    }

    /**
     * Helper method to safely get string value
     */
    private String safeStringValue(String value) {
        return value != null ? value : "";
    }
}