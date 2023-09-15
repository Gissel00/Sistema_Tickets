import { Component, OnInit } from '@angular/core';
import { UserService } from '../core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isAutheticate: boolean = false;

  isAuthenticated():void{
    this.userService.isAuthenticated.subscribe({
      next: authenticate => this.isAutheticate = authenticate
    })
  }

  constructor(private userService: UserService){}
  
  ngOnInit(): void {
    this.isAuthenticated();  
  }

}
