import { Employee } from './employee';

export interface RequestItem {
    id: number;
    description: string;
    quantity: number;
    requestId: number;
}

export interface Request {
    id: number;
    type: 'equipment' | 'leave' | 'resource' | 'other';
    status: 'Pending' | 'Approved' | 'Rejected';
    description: string;
    createdAt: string;
    updatedAt: string;
    employeeId: number;
    isActive: boolean;
    employee?: Employee;
    items?: RequestItem[];
} 