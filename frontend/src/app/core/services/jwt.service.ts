import { Injectable } from '@angular/core';
import { UserResponse } from '../interfaces/user.interface';


@Injectable()
export class JwtService {

  getToken(): string {
    return window.localStorage['jwtToken'];
  }

  saveToken(token: string) {
    window.localStorage['jwtToken'] = token;
  }
  saveUserInfo(userInfo: UserResponse) {
    window.localStorage['userInfo'] = JSON.stringify(userInfo);
  }

  getUserInfo(): string {
    return window.localStorage['userInfo'];
  }

  destroyAuthetication() {
    window.localStorage.removeItem('jwtToken');
    window.localStorage.removeItem('userInfo');
    window.localStorage.removeItem('authenticated');
  }

  saveAuthenticated(authenticated: boolean){
    window.localStorage['authenticated'] = authenticated;
  }

  getAuthenticated(){
    return window.localStorage['authenticated']
  }
}