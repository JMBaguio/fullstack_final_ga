import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '@app/_services/employee.service';
import { Employee } from '@app/_models/employee';
import { AccountService } from '@app/_services/account.service';
import { Account } from '@app/_models/account';
import { Department } from '@app/_models/department';
import { DepartmentService } from '@app/_services/department.service';

@Component({
    templateUrl: 'add-edit.component.html'
})
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;
    accounts: Account[] = [];
    departments: Department[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private employeeService: EmployeeService,
        private accountService: AccountService,
        private departmentService: DepartmentService
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        this.form = this.formBuilder.group({
            employeeId: [{ value: '', disabled: true }],
            account: [''],
            position: [''],
            department: [''],
            hireDate: [''],
            status: ['']
        });

        // Only get active accounts
        this.accountService.getAll().subscribe(accounts => {
            this.accounts = accounts.filter(acc => acc.isActive);
        });
        this.departmentService.getAll().subscribe(departments => this.departments = departments);

        if (!this.isAddMode) {
            this.employeeService.getById(this.id)
                .subscribe(employee => {
                    this.form.patchValue({
                        employeeId: employee.employeeId || '',
                        account: employee.account || '',
                        position: employee.position || '',
                        department: employee.department || '',
                        hireDate: employee.hireDate ? employee.hireDate.split('T')[0] : '',
                        status: employee.status || ''
                    });
                });
        } else {
            this.employeeService.getAll().subscribe(employees => {
                let max = 0;
                employees.forEach(emp => {
                    const match = emp.employeeId && emp.employeeId.match(/EMP(\d+)/);
                    if (match) {
                        const num = parseInt(match[1], 10);
                        if (num > max) max = num;
                    }
                });
                const nextId = 'EMP' + String(max + 1).padStart(3, '0');
                this.form.patchValue({ employeeId: nextId });
            });
        }
    }

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        if (this.form.invalid) {
            return;
        }
        this.loading = true;
        const formValue = { ...this.form.getRawValue() };

        // Convert department name to departmentId
        const selectedDept = this.departments.find(d => d.name === formValue.department);
        if (selectedDept) {
            formValue.departmentId = selectedDept.id;
        }
        delete formValue.department;

        // Convert account email to accountId
        const selectedAcc = this.accounts.find(a => a.email === formValue.account);
        if (selectedAcc) {
            formValue.accountId = selectedAcc.id;
        }
        delete formValue.account;

        if (this.isAddMode) {
            this.createEmployee(formValue);
        } else {
            this.updateEmployee(formValue);
        }
    }

    private createEmployee(formValue: any) {
        this.employeeService.create(formValue)
            .subscribe({
                next: () => {
                    this.router.navigate(['/admin/employees'], { relativeTo: this.route });
                },
                error: error => {
                    this.loading = false;
                }
            });
    }

    private updateEmployee(formValue: any) {
        this.employeeService.update(this.id, formValue)
            .subscribe({
                next: () => {
                    this.router.navigate(['/admin/employees'], { relativeTo: this.route });
                },
                error: error => {
                    this.loading = false;
                }
            });
    }
} 