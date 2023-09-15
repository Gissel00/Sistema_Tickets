import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ListErrorsComponent } from './list-errors.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TableComponent } from './table/table.component';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import {TooltipModule} from 'primeng/tooltip';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    ButtonModule,
    DialogModule,
    TooltipModule
  ],
  declarations: [

    ListErrorsComponent,
    SidebarComponent,
    TableComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ListErrorsComponent,
    RouterModule,
    SidebarComponent,
    TableComponent
  ]
})
export class SharedModule {}