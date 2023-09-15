import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component'
import {MenubarModule} from 'primeng/menubar'; 

@NgModule({
  declarations: [
    NavbarComponent
  ],
  imports: [
    CommonModule,
    MenubarModule
  ],
  exports: [NavbarComponent]
})
export class NavbarModule { }
