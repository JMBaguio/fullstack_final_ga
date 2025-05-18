import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/_helpers';
import { Role } from '@app/_models';

import { SubNavComponent } from './subnav.component'; 
import { LayoutComponent } from './layout.component'; 
import { OverviewComponent } from './overview.component';

const accountsModule = () => import('./accounts/accounts.module').then(x => x.AccountsModule);
const requestsModule = () => import('./requests/requests.module').then(x => x.RequestsModule);
const employeesModule = () => import('./employees/employees.module').then(x => x.EmployeesModule);
const departmentsModule = () => import('./departments/departments.module').then(x => x.DepartmentsModule);
const workflowsModule = () => import('./workflows/workflows.module').then(x => x.WorkflowsModule);

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] },
        children: [
            { path: '', component: OverviewComponent },
            { path: 'accounts', loadChildren: accountsModule, canActivate: [AuthGuard], data: { roles: [Role.Admin] } },
            { path: 'requests', loadChildren: requestsModule, canActivate: [AuthGuard], data: { roles: [Role.Admin] } },
            { path: 'employees', loadChildren: employeesModule, canActivate: [AuthGuard], data: { roles: [Role.Admin] } },
            { path: 'departments', loadChildren: departmentsModule, canActivate: [AuthGuard], data: { roles: [Role.Admin] } },
            { path: 'workflows', loadChildren: workflowsModule, canActivate: [AuthGuard], data: { roles: [Role.Admin] } }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }