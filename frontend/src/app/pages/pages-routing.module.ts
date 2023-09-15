import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { CreateTicketsComponent } from './create-tickets/create-tickets.component';
import { DepartmentsComponent } from './departments/departments.component';
import { StatusComponent } from './estados/status.component';
import { FlujosComponent } from './flujos/flujos.component';
import { GroupsComponent } from './groups/groups.component';
import { HorariosComponent } from './horario/horarios.component';
import { MyTicketsComponent } from './my-tickets/my-tickets.component';
import { PrioridadesComponent } from './prioridades/prioridades.component';
import { ProfileComponent } from './profile/profile.component';
import { ReportingComponent } from './reporting/reporting.component';
import { TicketsComponent } from './tickets/tickets.component';

const routes: Routes = [
  { 
    path: 'create-tickets', 
    component: CreateTicketsComponent
  },
  { 
    path: 'my-tickets', 
    component: MyTicketsComponent
  },
  { 
    path: 'reporting', 
    component: ReportingComponent
  },
  { 
    path: 'groups', 
    component: GroupsComponent
  },
  {
    path: 'priorities',
    component: PrioridadesComponent
  },
  {
    path: 'status',
    component: StatusComponent
  },
  {
    path: 'category',
    component: CategoriesComponent
  }, 
  {
    path: 'tickets/:id',
    component: TicketsComponent
  },
  {
    path: 'flujos',
    component: FlujosComponent
  },
  {
    path: 'departments',
    component: DepartmentsComponent
  },
  {
    path: 'my-profile',
    component: ProfileComponent
  },
  {
    path: 'horarios',
    component: HorariosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
