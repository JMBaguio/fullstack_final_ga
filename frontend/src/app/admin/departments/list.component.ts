import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DepartmentService } from '../../_services/department.service';
import { Department } from '../../_models/department';
import { EmployeeService } from '../../_services/employee.service';
import { Employee } from '../../_models/employee';

@Component({
    templateUrl: 'list.component.html'
})
export class ListComponent implements OnInit {
    departments: (Department & { employeeCount?: number })[] = [];
    employees: Employee[] = [];

    constructor(
        private departmentService: DepartmentService,
        private employeeService: EmployeeService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadDepartments();
    }

    loadDepartments() {
        this.employeeService.getAll().subscribe(employees => {
            this.employees = employees;
            this.departmentService.getAll().subscribe(departments => {
                this.departments = departments.map(dept => ({
                    ...dept,
                    employeeCount: employees.filter(emp => emp.department === dept.name).length
                }));
            });
        });
    }

    add() {
        this.router.navigate(['/admin/departments/add']);
    }

    edit(id: string) {
        this.router.navigate(['/admin/departments/edit', id]);
    }

    delete(id: string) {
        if (confirm('Are you sure you want to delete this department?')) {
            this.departmentService.delete(id).subscribe(() => this.loadDepartments());
        }
    }
} 