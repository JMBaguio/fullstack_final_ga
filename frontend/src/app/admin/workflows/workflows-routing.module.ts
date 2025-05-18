import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';
import { AuthGuard } from '@app/_helpers';
import { Role } from '@app/_models';

const routes: Routes = [
    {
        path: '', component: ListComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] }
    },
    {
        path: 'add', component: AddEditComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] }
    },
    {
        path: 'edit/:id', component: AddEditComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WorkflowsRoutingModule { } 