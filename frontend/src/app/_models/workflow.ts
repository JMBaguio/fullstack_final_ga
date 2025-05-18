export interface Workflow {
    id?: number;
    employeeId: string;
    type: 'onboarding' | 'offboarding' | 'transfer' | 'promotion';
    status: 'pending' | 'in_progress' | 'completed' | 'rejected';
    startDate: Date;
    endDate?: Date;
    description?: string;
    currentStep: number;
    totalSteps: number;
    metadata?: any;
    createdAt?: Date;
    updatedAt?: Date;
} 