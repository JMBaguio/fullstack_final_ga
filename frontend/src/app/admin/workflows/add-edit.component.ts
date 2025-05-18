import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Workflow } from '@app/_models/workflow';
import { WorkflowService } from '@app/_services/workflow.service';
import { AlertService } from '@app/_services/alert.service';

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

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private workflowService: WorkflowService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        this.form = this.formBuilder.group({
            employeeId: ['', Validators.required],
            type: ['', Validators.required],
            status: ['pending', Validators.required],
            startDate: ['', Validators.required],
            endDate: [''],
            description: [''],
            currentStep: [1, [Validators.required, Validators.min(1)]],
            totalSteps: [1, [Validators.required, Validators.min(1)]],
            metadata: [{}]
        });

        if (!this.isAddMode) {
            this.workflowService.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.form.patchValue(x);
                });
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createWorkflow();
        } else {
            this.updateWorkflow();
        }
    }

    private createWorkflow() {
        this.workflowService.create(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Workflow created successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    private updateWorkflow() {
        this.workflowService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Workflow updated successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['../../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
} 