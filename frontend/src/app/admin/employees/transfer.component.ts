import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { EmployeeService } from '@app/_services/employee.service';
import { DepartmentService } from '@app/_services/department.service';
import { Employee } from '@app/_models/employee';

interface TransferResponse {
    message: string;
    id: string;
    employeeId: string;
    department: string;
    account: string;
}

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1040;
    }
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1050;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class TransferComponent implements OnInit {
  employee: Employee;
  departments: any[] = [];
  departmentId: number;
  loading = false;
  submitted = false;
  error: string;
  success: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService
  ) { }

  ngOnInit() {
    const employeeId = this.route.snapshot.params['id'];
    if (!employeeId) {
      this.error = 'Employee ID is required';
      return;
    }
    this.loadEmployee(employeeId);
    this.loadDepartments();
  }

  private loadEmployee(id: string) {
    this.loading = true;
    this.employeeService.getById(id)
      .pipe(first())
      .subscribe({
        next: (employee) => {
          this.employee = employee;
          // Convert department string to number if it's a valid number
          const deptId = parseInt(employee.department);
          this.departmentId = !isNaN(deptId) ? deptId : null;
          this.loading = false;
        },
        error: (error) => {
          this.error = error.error?.message || 'Error loading employee data';
          this.loading = false;
          console.error('Error loading employee:', error);
        }
      });
  }

  private loadDepartments() {
    this.departmentService.getAll()
      .pipe(first())
      .subscribe({
        next: (departments) => this.departments = departments,
        error: (error) => {
          this.error = error.error?.message || 'Error loading departments';
          console.error('Error loading departments:', error);
        }
      });
  }

  transfer() {
    this.submitted = true;
    this.error = null;
    this.success = null;

    // Validate department selection
    if (!this.departmentId) {
      this.error = 'Please select a department';
      return;
    }

    // Validate employee exists
    if (!this.employee || !this.employee.employeeId) {
      this.error = 'Employee data is not available';
      return;
    }

    this.loading = true;
    console.log('Initiating transfer:', { 
      employeeId: this.employee.employeeId, 
      departmentId: this.departmentId,
      currentDepartment: this.employee.department 
    });

    this.employeeService.transfer(this.employee.employeeId, this.departmentId)
      .pipe(first())
      .subscribe({
        next: (response: TransferResponse) => {
          console.log('Transfer response:', response);
          this.success = response.message || 'Employee transferred successfully';
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/admin/employees']);
          }, 1500);
        },
        error: (error) => {
          console.error('Transfer error:', error);
          this.error = error.error?.message || 'Error transferring employee';
          this.loading = false;
        }
      });
  }

  cancel() {
    this.router.navigate(['/admin/employees']);
  }
} 