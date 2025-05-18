import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Request } from '@app/_models/request';
import { RequestService } from '@app/_services/request.service';
import { AccountService } from '@app/_services/account.service';

@Component({
    templateUrl: 'list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
    requests: Request[] = [];
    loading = false;
    isAdmin = false;

    constructor(
        private requestService: RequestService,
        private accountService: AccountService
    ) {
        this.isAdmin = this.accountService.accountValue?.role === 'Admin';
    }

    ngOnInit() {
        this.loading = true;
        if (this.isAdmin) {
            this.requestService.getAll()
                .pipe(first())
                .subscribe(requests => {
                    this.requests = requests;
                    this.loading = false;
                });
        } else {
            const employeeId = this.accountService.accountValue?.id;
            if (employeeId) {
                this.requestService.getByEmployeeId(Number(employeeId))
                    .pipe(first())
                    .subscribe(requests => {
                        this.requests = requests;
                        this.loading = false;
                    });
            }
        }
    }

    deleteRequest(id: number) {
        if (!confirm('Are you sure you want to delete this request?')) return;
        this.loading = true;
        this.requestService.delete(id)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.requests = this.requests.filter(x => x.id !== id);
                    this.loading = false;
                },
                error: err => {
                    alert('Failed to delete request.');
                    this.loading = false;
                }
            });
    }

    approveRequest(id: number) {
        this.loading = true;
        this.requestService.approve(id)
            .pipe(first())
            .subscribe({
                next: updatedRequest => {
                    const index = this.requests.findIndex(x => x.id === id);
                    if (index !== -1) this.requests[index] = updatedRequest;
                    this.loading = false;
                },
                error: err => {
                    alert('Failed to approve request.');
                    this.loading = false;
                }
            });
    }

    rejectRequest(id: number) {
        this.loading = true;
        this.requestService.reject(id)
            .pipe(first())
            .subscribe({
                next: updatedRequest => {
                    const index = this.requests.findIndex(x => x.id === id);
                    if (index !== -1) this.requests[index] = updatedRequest;
                    this.loading = false;
                },
                error: err => {
                    alert('Failed to reject request.');
                    this.loading = false;
                }
            });
    }
}
