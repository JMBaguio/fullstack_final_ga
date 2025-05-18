import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Request } from '@app/_models/request';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class RequestService {
    constructor(private http: HttpClient) { }

    getAll(): Observable<Request[]> {
        return this.http.get<Request[]>(`${environment.apiUrl}/requests`);
    }

    getById(id: number): Observable<Request> {
        return this.http.get<Request>(`${environment.apiUrl}/requests/${id}`);
    }

    getByEmployeeId(employeeId: number): Observable<Request[]> {
        return this.http.get<Request[]>(`${environment.apiUrl}/requests/employee/${employeeId}`);
    }

    create(request: Request): Observable<Request> {
        return this.http.post<Request>(`${environment.apiUrl}/requests`, request);
    }

    update(id: number, request: Request): Observable<Request> {
        return this.http.put<Request>(`${environment.apiUrl}/requests/${id}`, request);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}/requests/${id}`);
    }

    approve(id: number): Observable<Request> {
        return this.http.put<Request>(`${environment.apiUrl}/requests/${id}/approve`, {});
    }

    reject(id: number): Observable<Request> {
        return this.http.put<Request>(`${environment.apiUrl}/requests/${id}/reject`, {});
    }
} 