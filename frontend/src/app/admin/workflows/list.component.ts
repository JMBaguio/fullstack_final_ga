import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { Workflow } from '@app/_models/workflow';
import { WorkflowService } from '@app/_services/workflow.service';
import { AlertService } from '@app/_services/alert.service';

@Component({
    templateUrl: 'list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
    workflows: Workflow[] = [];
    loading = false;
    employeeId: string = null;
    selectedStatus: string = '';
    selectedType: string = '';

    constructor(
        private workflowService: WorkflowService,
        private alertService: AlertService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        console.log('Initializing workflow list component');
        // Get employeeId from query params
        this.route.queryParams.subscribe(params => {
            console.log('Query params:', params);
            this.employeeId = params['employeeId'];
            console.log('Employee ID:', this.employeeId);
            if (this.employeeId) {
                this.loadEmployeeWorkflows();
            } else {
                this.loadWorkflows();
            }
        });
    }

    loadWorkflows() {
        console.log('Loading all workflows');
        this.loading = true;
        this.workflowService.getAll()
            .pipe(first())
            .subscribe({
                next: workflows => {
                    console.log('Workflows loaded:', workflows);
                    this.workflows = workflows;
                    this.loading = false;
                },
                error: error => {
                    console.error('Error loading workflows:', error);
                    this.alertService.error('Error loading workflows: ' + error.message);
                    this.loading = false;
                }
            });
    }

    loadEmployeeWorkflows() {
        if (!this.employeeId) {
            console.error('Employee ID is missing');
            this.alertService.error('Employee ID is required');
            return;
        }

        console.log('Loading workflows for employee:', this.employeeId);
        this.loading = true;
        this.workflowService.getByEmployeeId(this.employeeId)
            .pipe(first())
            .subscribe({
                next: workflows => {
                    console.log('Employee workflows loaded:', workflows);
                    this.workflows = workflows;
                    this.loading = false;
                },
                error: error => {
                    console.error('Error loading employee workflows:', error);
                    this.alertService.error('Error loading employee workflows: ' + error.message);
                    this.loading = false;
                }
            });
    }

    filterWorkflows() {
        if (this.employeeId) {
            this.loadEmployeeWorkflows();
        } else {
            this.loadWorkflows();
        }
    }

    updateStatus(id: number, status: string) {
        console.log('Updating workflow status:', { id, status });
        this.workflowService.updateStatus(id, status)
            .pipe(first())
            .subscribe({
                next: () => {
                    console.log('Workflow status updated successfully');
                    this.alertService.success('Workflow status updated successfully');
                    if (this.employeeId) {
                        this.loadEmployeeWorkflows();
                    } else {
                        this.loadWorkflows();
                    }
                },
                error: error => {
                    console.error('Error updating workflow status:', error);
                    this.alertService.error('Error updating workflow status: ' + error.message);
                }
            });
    }

    onStatusChange(workflow: Workflow, newStatus: string) {
        if (workflow.status === newStatus) return;
        this.updateStatus(workflow.id, newStatus);
    }
} 