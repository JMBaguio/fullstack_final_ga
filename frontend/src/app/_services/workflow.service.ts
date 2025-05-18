import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Workflow } from '@app/_models/workflow';

@Injectable({ providedIn: 'root' })
export class WorkflowService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Workflow[]>(`${environment.apiUrl}/workflows`);
    }

    getById(id: number) {
        return this.http.get<Workflow>(`${environment.apiUrl}/workflows/${id}`);
    }

    getByEmployeeId(employeeId: string) {
        return this.http.get<Workflow[]>(`${environment.apiUrl}/workflows/employee/${employeeId}`);
    }

    create(workflow: Workflow) {
        return this.http.post(`${environment.apiUrl}/workflows`, workflow);
    }

    update(id: number, workflow: Workflow) {
        return this.http.put(`${environment.apiUrl}/workflows/${id}`, workflow);
    }

    updateStatus(id: number, status: string) {
        return this.http.put(`${environment.apiUrl}/workflows/${id}/status`, { status });
    }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/workflows/${id}`);
    }
} 