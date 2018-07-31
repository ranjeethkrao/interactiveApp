import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class LoginService {

  constructor(private http: Http, private authService: AuthService) { }

  login(){
    this.authService.login();
  }

  logOut(){
    this.authService.logout();
  }

  public getUserFromFirebase(email) {
    return this.http.get('/auth/fetchUserByEmail/' + email).map(res => res.json());
  }

}
