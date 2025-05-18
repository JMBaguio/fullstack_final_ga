import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { RequestService } from '@app/_services/request.service';
import { Request, RequestItem } from '@app/_models/request';
import { AccountService } from '@app/_services/account.service';
import { EmployeeService } from '@app/_services/employee.service';
import { Employee } from '@app/_models/employee';

@Component({
    templateUrl: 'add-edit.component.html',
    styleUrls: ['./add-edit.component.css']
})
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: number;
    isAddMode: boolean;
    loading = false;
    submitted = false;
    requestTypes = ['equipment', 'leave', 'resource', 'other'];
    employees: Employee[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private requestService: RequestService,
        private accountService: AccountService,
        private employeeService: EmployeeService
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        this.form = this.formBuilder.group({
            type: ['', Validators.required],
            description: ['', Validators.required],
            employeeId: ['', Validators.required],
            items: this.formBuilder.array([])
        });

        this.employeeService.getAll().subscribe(employees => {
            this.employees = employees;
        });

        if (!this.isAddMode) {
            this.loading = true;
            this.requestService.getById(this.id)
                .pipe(first())
                .subscribe(request => {
                    this.form.patchValue(request);
                    if (request.items) {
                        request.items.forEach(item => {
                            this.addItem(item);
                        });
                    }
                    this.loading = false;
                });
        }
    }

    // convenience getters for easy access to form fields
    get f() { return this.form.controls; }
    get items() { return this.form.get('items') as FormArray; }

    addItem(item?: RequestItem) {
        const itemForm = this.formBuilder.group({
            description: [item?.description || '', Validators.required],
            quantity: [item?.quantity || 1, [Validators.required, Validators.min(1)]]
        });
        this.items.push(itemForm);
    }

    removeItem(index: number) {
        this.items.removeAt(index);
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createRequest();
        } else {
            this.updateRequest();
        }
    }

    private createRequest() {
        const requestPayload = {
            ...this.form.value
        };
        this.requestService.create(requestPayload)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    console.error('Error creating request:', error);
                    this.loading = false;
                }
            });
    }

    private updateRequest() {
        this.requestService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    console.error('Error updating request:', error);
                    this.loading = false;
                }
            });
    }
}
