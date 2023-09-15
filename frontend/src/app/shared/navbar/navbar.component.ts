import { Component } from '@angular/core'; 
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  navbarItems: MenuItem[] = [];

  ngOnInit(): void {
    this.navbarItems = [
      {
        label: 'Home',
        icon: 'pi pi-fw pi-home',
        routerLink: ['/my-tickets']
      },
      {
        label: 'User',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'Mi Perfil',
            icon: 'pi pi-fw pi-user-edit',
            routerLink: ['/my-profile']
          },
          { 
            label: 'Logout', 
            icon: 'pi pi-fw pi-sign-out',
            command: () => {
              this.userService.purgeAuth();
              this.router.navigateByUrl('/login');
            }
          }
        ]
      }
    ]
  }

  constructor(private router: Router, private userService: UserService) {}  

}
