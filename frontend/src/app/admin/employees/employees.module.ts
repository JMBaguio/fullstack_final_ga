import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EmployeesRoutingModule } from './employees-routing.module';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';
import { TransferComponent } from './transfer.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        EmployeesRoutingModule
    ],
    declarations: [
        ListComponent,
        AddEditComponent,
        TransferComponent
    ]
})
export class EmployeesModule { } 