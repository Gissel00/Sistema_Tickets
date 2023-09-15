import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { CreateTicketsComponent } from './create-tickets/create-tickets.component';
import { MyTicketsComponent } from './my-tickets/my-tickets.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { GroupsComponent } from './groups/groups.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';
import { PrioridadesComponent } from './prioridades/prioridades.component';
import { StatusComponent } from './estados/status.component';
import { CategoriesComponent } from './categories/categories.component';
import { TicketsComponent } from './tickets/tickets.component';
import { FlujosComponent } from './flujos/flujos.component';
import { DepartmentsComponent } from './departments/departments.component';
import { ReportingComponent } from './reporting/reporting.component'
import {TableModule} from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { ProfileComponent } from './profile/profile.component';
import { MatInputModule } from '@angular/material/input'; 
import { HorariosComponent } from './horario/horarios.component';

@NgModule({
  declarations: [
    CreateTicketsComponent,
    MyTicketsComponent,
    GroupsComponent,
    PrioridadesComponent,
    StatusComponent,
    CategoriesComponent,
    TicketsComponent,
    FlujosComponent,
    DepartmentsComponent,
    ReportingComponent,
    ProfileComponent,
    HorariosComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    DialogModule,
    ButtonModule,
    DropdownModule,
    CalendarModule,
    TooltipModule,
    TableModule,
    PanelModule,
    MatInputModule
  ]
})
export class PagesModule { }
