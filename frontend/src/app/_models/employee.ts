export interface Employee {
    id?: string;
    employeeId: string;
    account: string;
    position: string;
    department: string;
    hireDate: string;
    status: 'Active' | 'Inactive';
}