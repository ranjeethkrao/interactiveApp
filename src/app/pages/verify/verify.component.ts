import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RegisterService } from '../register/register.service';
import { Router, ActivatedRoute } from '../../../../node_modules/@angular/router';
import * as firebase from 'firebase';
import { VerifyService } from './verify.service';
import swal from 'sweetalert2';

@Component({
  selector: 'mg-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit, AfterViewInit {

  windowRef: any;
  user: any = {};
  phoneVerified: boolean = false;
  emailVerified: boolean = false;
  smsSent: boolean = false;
  invalid: boolean = false;

  constructor(private reg: RegisterService, private router: Router, private verifyService: VerifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    let username = this.reg.getCurrentUser();
    if (username.length > 0) {    //Users landing from login page
      console.log(username, 'if');

      this.reg.getUserFromFirebase(username).subscribe(res => {
        this.user = res;
        this.phoneVerified = this.user.phoneVerified;
        this.emailVerified = this.user.emailVerified;

      });
    } else {
      this.route.queryParamMap.subscribe(params => {   //Users landing from email link
        let uid = params.get('uid');
        let username = params.get('username');
        if (username && username.length > 0) {
          // this.reg.setCurrentUser(username);
          this.reg.emailVerified(uid, username).subscribe(data => {

            this.reg.getUserFromFirebase(username).subscribe(res => {
              if (Object.keys(res).length === 0) {
                this.invalid = true;
              } else {
                this.user = res;

                this.phoneVerified = this.user.phoneVerified;
                this.emailVerified = true;    //As we know this came from the email link

              }
            })
          });

        } else {
          this.invalid = true;    //Users trying to access verify page through URL
        }
      })
    }
  }

  ngAfterViewInit() {
    if (!this.phoneVerified) {
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

  resendOtp() {
    // this.user.phone=;
    const appVerifier = this.windowRef.recaptchaVerifier;
    firebase.auth().signInWithPhoneNumber("+919740433888", appVerifier)
      .then((result) => {
        this.windowRef.confirmationResult = result;
        if (this.windowRef.confirmationResult) {
          this.smsSent = true;
        }
      })
      .catch((error) => {
        swal(
          'Oops...',
          error.message,
          'error'
        )
      });
  }


  // verifyOtpService(code){

  //   return new Promise((resolve, reject) => {
  //       this.windowRef.confirmationResult.confirm(code)
  //       .then((result) => {
  //           resolve(result);
  //       })
  //       .catch((error) => {
  //           reject(error);
  //       })
  //   });

  // }

  // verifyOtp(code){
  //   this.verifyOtpService(code)
  //       .then((result) => {
  //         console.log(result);
  //       })
  //       .catch((error) => {
  //         console.log(error)
  //         swal(
  //           'Oops...',
  //           error.message,
  //           'error'
  //       )
  //       })
  // }

  verifyOtp(code) {
    let self = this;
    this.windowRef.confirmationResult.confirm(code)
      .then((result) => {
        swal({
          type: 'success',
          title: 'You have successfully registered with your phone number !'
        });
        self.phoneVerified = true;
        this.reg.phoneVerified().subscribe(data => { });
      })
      .catch((error) => {
        swal({
          type: 'error',
          title: 'Could not register with the provided phone number !'
        });
      })
  }
}
