import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountsRoutingModule } from './accounts-routing.module';

import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';

@NgModule({
  declarations: [
    ListComponent,
    AddEditComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AccountsRoutingModule
  ]
})
export class AccountsModule { }