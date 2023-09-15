import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { HomeModule } from './home/home.module';
import { NavbarModule } from './shared/navbar/navbar.module';
import { PagesModule } from './pages/pages.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { LoadingComponent } from './shared/loading';

@NgModule({
  declarations: [
    AppComponent, LoadingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    AuthModule,
    SharedModule,
    HomeModule,
    NavbarModule,
    PagesModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
