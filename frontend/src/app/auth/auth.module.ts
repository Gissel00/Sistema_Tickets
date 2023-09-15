import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { SharedModule } from '../shared/shared.module';
import { NoAuthGuard } from './no-auth-guard.service';

@NgModule({
  declarations: [
    AuthComponent
  ],
  imports: [
    AuthRoutingModule,
    SharedModule
  ],
  providers: [
    NoAuthGuard
  ]
})
export class AuthModule { }
