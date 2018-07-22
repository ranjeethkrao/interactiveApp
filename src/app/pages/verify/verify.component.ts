import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RegisterService } from '../register/register.service';
import { Router } from '../../../../node_modules/@angular/router';
import * as firebase from 'firebase';
import { VerifyService } from './verify.service';

@Component({
  selector: 'mg-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit, AfterViewInit {

  windowRef: any;
  user: any = {};
  phoneVerified: boolean = false;
  emailVerified: boolean = true;
  smsSent: boolean = false;

  constructor(private reg: RegisterService, private router: Router, private verifyService: VerifyService) { }

  ngOnInit() {
    let username = this.reg.getCurrentUser();
    this.reg.getUserFromFirebase(username).subscribe(res=>{
      console.log(res);
      
      this.user = res;
      this.phoneVerified = this.user.phoneVerified;
      this.emailVerified = this.user.emailVerified;
    });
  }

  ngAfterViewInit(){
    if(!this.phoneVerified){
      this.windowRef = this.reg.windowRef;
      this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
          'size': 'normal'
      });
      this.windowRef.recaptchaVerifier.render();
    }
  }

  gotoLogin() {
    this.router.navigate(['/login']);
  }

  resendOtp(){

  }

}
