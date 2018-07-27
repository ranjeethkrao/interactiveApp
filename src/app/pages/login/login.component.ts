import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { RegisterService } from '../register/register.service';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

declare var $: any;

@Component({
    selector: 'app-login-cmp',
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {
    test: Date = new Date();
    private toggleButton: any;
    public loginForm: FormGroup;

    constructor(private element: ElementRef, fb: FormBuilder, private loginService: LoginService, private router: Router, private reg: RegisterService) {

        this.loginForm = fb.group({
            'email': ['', Validators.compose([Validators.required, CustomValidators.email])],
            'password': ['', Validators.compose([Validators.required])]
        });
    }

    ngOnInit() {
        setTimeout(function() {
            // after 1000 ms we add the class animated to the login/register card
            $('.card').removeClass('card-hidden');
        }, 700);
    }
    /* sidebarToggle() {
        var toggleButton = this.toggleButton;
        var body = document.getElementsByTagName('body')[0];
        var sidebar = document.getElementsByClassName('navbar-collapse')[0];
        if (this.sidebarVisible == false) {
            setTimeout(function() {
                toggleButton.classList.add('toggled');
            }, 500);
            body.classList.add('nav-open');
            this.sidebarVisible = true;
        } else {
            this.toggleButton.classList.remove('toggled');
            this.sidebarVisible = false;
            body.classList.remove('nav-open');
        }
    } */

    login(val){
        console.log(firebase.auth().currentUser);
        this.loginService.getUserFromFirebase(val.email).subscribe(user =>{
            this.reg.setCurrentUser(user.username);
            if(!user['phoneVerified'] || !user['emailVerified']){
                this.router.navigate(['/verify'], { queryParams: {username: user.username} });
            }
        })
        // this.loginService.login(val).then(res=>{

        // })

    }
}
