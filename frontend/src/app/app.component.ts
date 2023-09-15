import { Component, OnInit } from "@angular/core";
import {  } from "rxjs/operators";

import { JwtService, UserService } from "./core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  private evaluateLS:string = this.jwtService.getAuthenticated() ?? 'false';
  private isAutheticate: boolean = this.evaluateLS === 'true';
  constructor(private userService: UserService, private jwtService: JwtService) {}

  isAuthenticated():void{
    this.userService.isAuthenticated.subscribe({
      next: authenticate => this.isAutheticate = authenticate
    })
  }

  setAuthenticate(value: boolean) {
    this.isAutheticate = value;
  }

  get getAuthenticate(): boolean {
    return this.isAutheticate;
  }

  ngOnInit() {
    this.userService.populate();
    this.isAuthenticated();
  }
}