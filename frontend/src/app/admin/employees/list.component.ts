import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '@app/_services/employee.services';
import { Employee } from '@app/_models/employee';

@Component({
    templateUrl: 'list.component.html'
})
export class ListComponent implements OnInit {
    employees: Employee[] = [];

    constructor(
        private employeeService: EmployeeService,
        private router: Router
    ) { }

    ngOnInit() {
        this.employeeService.getAll().subscribe(employees => this.employees = employees);
    }

    add() {
        this.router.navigate(['/admin/employees/add']);
    }

    edit(id: number) {
        this.router.navigate(['/admin/employees/edit', id]);
    }

    viewRequests(id: number) {
        this.router.navigate(['/admin/requests'], { queryParams: { employeeId: id } });
    }

    viewWorkflows(id: number) {
        this.router.navigate(['/admin/workflows'], { queryParams: { employeeId: id } });
    }

    transfer(id: number) {
        this.router.navigate(['/admin/employees/transfer', id]);
    }
} 