import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Employee } from '@app/_models/employee';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
    constructor(private http: HttpClient) {}

    getAll() {
        return this.http.get<Employee[]>(`${environment.apiUrl}/employees`);
    }

    getById(id: string) {
        return this.http.get<Employee>(`${environment.apiUrl}/employees/${id}`);
    }

    create(employee: Employee) {
        return this.http.post(`${environment.apiUrl}/employees`, employee);
    }

    update(id: string, employee: Employee) {
        return this.http.put(`${environment.apiUrl}/employees/${id}`, employee);
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/employees/${id}`);
    }

    transfer(employeeId: string, departmentId: number) {
        if (!employeeId || !departmentId) {
            throw new Error('Employee ID and department ID are required');
        }
        console.log('Transfer request:', { 
            employeeId, 
            newDepartmentId: departmentId 
        });
        return this.http.post<any>(`${environment.apiUrl}/employees/transfer`, {
            employeeId: employeeId.toString(),
            newDepartmentId: Number(departmentId)
        });
    }
} 