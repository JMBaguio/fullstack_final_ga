import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from '../../_services/department.service';
import { Department } from '../../_models/department';

@Component({
    templateUrl: 'add-edit.component.html'
})
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private departmentService: DepartmentService
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            description: ['']
        });

        if (!this.isAddMode) {
            this.departmentService.getById(this.id)
                .subscribe(x => this.form.patchValue(x));
        }
    }

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        if (this.form.invalid) {
            return;
        }
        this.loading = true;
        if (this.isAddMode) {
            this.createDepartment();
        } else {
            this.updateDepartment();
        }
    }

    private createDepartment() {
        this.departmentService.create(this.form.value)
            .subscribe({
                next: () => {
                    this.router.navigate(['/admin/departments'], { relativeTo: this.route });
                },
                error: error => {
                    this.loading = false;
                }
            });
    }

    private updateDepartment() {
        this.departmentService.update(this.id, this.form.value)
            .subscribe({
                next: () => {
                    this.router.navigate(['/admin/departments'], { relativeTo: this.route });
                },
                error: error => {
                    this.loading = false;
                }
            });
    }
} 