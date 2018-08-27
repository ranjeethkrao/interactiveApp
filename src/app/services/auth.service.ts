import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class AuthService {

  constructor() {}

  private loggedIn = new BehaviorSubject<boolean>(this.isTokenPresent());
  
  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  isTokenPresent(){
    return !!localStorage.getItem('user');
  }

  login(){
    this.loggedIn.next(true);
  }

  logout() {
    this.loggedIn.next(false);
    localStorage.clear();
  }

  
}
