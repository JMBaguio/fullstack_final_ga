import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { WorkflowsRoutingModule } from './workflows-routing.module';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        WorkflowsRoutingModule
    ],
    declarations: [
        ListComponent,
        AddEditComponent
    ]
})
export class WorkflowsModule { } 