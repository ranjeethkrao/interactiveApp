import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class LoginService {

  constructor(private http: Http) { }

  login(){}

  public getUserFromFirebase(email) {
    return this.http.get('/auth/fetchUserByEmail/' + email).map(res => res.json());
  }

}
