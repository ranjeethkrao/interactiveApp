import { Component, OnInit, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CustomValidators } from 'ng2-validation';

import { RegisterService } from './register.service';

import * as firebase from 'firebase';
import swal from 'sweetalert2';
import { Observable } from 'rxjs/Observable';

declare const $: any;

@Component({
    selector: 'app-register-cmp',
    templateUrl: './register.component.html'
})

export class RegisterComponent implements OnInit, AfterViewInit {
    test: Date = new Date();

    public tradersRegForm: FormGroup;

    public firstname: AbstractControl;
    public lastname: AbstractControl;
    public email: AbstractControl;
    public phone: AbstractControl;
    public addressLine1: AbstractControl;
    public addressLine2: AbstractControl;
    public pincode: AbstractControl;
    public country: AbstractControl;
    public state: AbstractControl;
    public city: AbstractControl;
    public tradeExp: AbstractControl;
    public tradeFeq: AbstractControl;
    public interest: AbstractControl;
    public brokeAcc: AbstractControl;
    public username: AbstractControl;
    public password: AbstractControl;
    public confPass: AbstractControl;

    windowRef: any;
    userData: Observable<any[]>;

    private countryOptions = [];
    private countrySettings = {};
    private countrySelectedItem = [];

    private tradingExpOptions = [];
    private tradingExpSettings = {};
    private tradingExpSelectedItem = [];

    private tradingFeqOptions = [];
    private tradeFeqSettings = {};
    private tradeFeqSelectedItem = [];

    private brokeAccOptions = [];
    private brokeAccSettings = {};
    private brokeAccSelectedItem = [];

    private interestOptions = [];
    private interestSettings = {};
    private interestSelectedItems = [];

    private registrationComplete: boolean = false;

    constructor(private reg: RegisterService, fb: FormBuilder, private router: Router) {

        this.tradersRegForm = fb.group({
            'firstname': ['', Validators.compose([CustomValidators.rangeLength([5, 30])])],
            'lastname': ['', Validators.compose([CustomValidators.rangeLength([3, 30])])],
            'email': ['', Validators.compose([CustomValidators.email])],
            'phone': ['', Validators.compose([CustomValidators.phone('IN')])],
            'addressLine1': ['', Validators.compose([Validators.required])],
            'addressLine2': ['', Validators.compose([Validators.required])],
            'pincode': ['', Validators.compose([CustomValidators.digits])],
            'country': ['', Validators.compose([CustomValidators.rangeLength([5, 50])])],
            'state': ['', Validators.compose([Validators.required])],
            'city': ['', Validators.compose([Validators.required])],
            'tradeExp': ['', Validators.compose([Validators.required])],
            'tradeFeq': ['', Validators.compose([Validators.required])],
            'interest': ['', Validators.compose([Validators.required])],
            'brokeAcc': ['', Validators.compose([Validators.required])],
            'username': ['', Validators.compose([Validators.required])],
            'password': ['', Validators.compose([Validators.required])],
            'confPass': ['', Validators.compose([Validators.required])]
        });



        this.firstname = this.tradersRegForm.controls['firstname'];
        this.lastname = this.tradersRegForm.controls['lastname'];
        this.email = this.tradersRegForm.controls['email'];
        this.phone = this.tradersRegForm.controls['phone'];
        this.addressLine1 = this.tradersRegForm.controls['addressLine1'];
        this.addressLine2 = this.tradersRegForm.controls['addressLine2'];
        this.pincode = this.tradersRegForm.controls['pincode'];
        this.country = this.tradersRegForm.controls['country'];
        this.state = this.tradersRegForm.controls['state'];
        this.city = this.tradersRegForm.controls['city'];
        this.tradeExp = this.tradersRegForm.controls['tradeExp'];
        this.tradeFeq = this.tradersRegForm.controls['tradeFeq'];
        this.interest = this.tradersRegForm.controls['interest'];
        this.brokeAcc = this.tradersRegForm.controls['brokeAcc'];
        this.username = this.tradersRegForm.controls['username'];
        this.password = this.tradersRegForm.controls['password'];
        this.confPass = this.tradersRegForm.controls['confPass'];

        this.countrySettings = {
            singleSelection: true,
            text: "Select Country Of Residence",
            enableSearchFilter: true
        }

        this.tradingExpSettings = {
            singleSelection: true,
            text: "How many years of trading experience do you have ?",
            enableSearchFilter: true
        }

        this.tradeFeqSettings = {
            singleSelection: true,
            text: "How many times do you trade each month ?",
            enableSearchFilter: true
        }

        this.interestSettings = {
            singleSelection: false,
            text: "What products are you interested in trading ? (Check as many that apply)",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            badgeShowLimit: 3,
            enableSearchFilter: true
        };

        this.brokeAccSettings = {
            singleSelection: true,
            text: "Do you have an existing brokerage account ?",
            enableSearchFilter: false
        }
    }

    ngOnInit(){
        this.reg.fetchAllCountries().subscribe((data) => {
            this.countryOptions = [];
            for (let obj of data) {
                this.countryOptions.push({
                    id: obj['code'],
                    itemName: obj['name']
                });
            }
        });

        this.tradingExpOptions = this.reg.getTradingExperience();
        this.tradingFeqOptions = this.reg.getTradeTimes();
        this.brokeAccOptions = this.reg.getBrokerageAccOption();
        this.interestOptions = this.reg.getInterest();
    }

    ngAfterViewInit() {

        $.validator.addMethod('magnitudinisphone', function (value, element) {
            return this.optional(element) || /([0-9]{10})|(\([0-9]{3}\)\s+[0-9]{3}\-[0-9]{4})/.test(value);
        }, "Please enter a valid phone number");

        $.validator.addMethod('uniqueEmail', function (value, element) {
            var param = {
                url: '/auth/emailExists',
                type: 'GET',
                dataType: "json"
            }
            return !$.validator.methods.remote.call(this, value, element, param);
        }, "Email already registered! Please Login or use different email id.");

        $.validator.addMethod('uniquePhone', function (value, element) {
            var param = {
                url: '/auth/phoneExists',
                type: 'GET',
                dataType: "json"
            }
            return !$.validator.methods.remote.call(this, value, element, param);
        }, "Phone number already registered! Please Login or use different number.");

        $.validator.addMethod('uniqueUserId', function (value, element) {
            var param = {
                url: '/auth/userIdExists',
                type: 'GET',
                dataType: "json"
            }
            return !$.validator.methods.remote.call(this, value, element, param);
        }, "User Id already taken! Please Login or choose a different user id.");

        const $validator = $(".wizard-card form").validate({
            rules: {
                firstname: { required: true, minlength: 5 },
                lastname: { required: true, minlength: 3 },
                email: { required: true, minlength: 3, email: true, uniqueEmail: true },
                phone: { required: true, magnitudinisphone: true, uniquePhone: true },
                addressLine1: { required: true },
                addressLine2: { required: true },
                country: { required: true },
                state: { required: true },
                city: { required: true },
                pincode: { required: true, digits: true },
                username: { required: true, uniqueUserId: true },
                password: { minlength: 8 },
                confPass: { minlength: 8, equalTo: '#password' }
            }
        });

        $('.wizard-card').bootstrapWizard({
            'tabClass': 'nav nav-pills',
            'nextSelector': '.btn-next',
            'previousSelector': '.btn-previous',

            onNext: function (tab: any, navigation: any, index: any) {
                const $valid = $('.wizard-card form').valid();
                if (!$valid) {
                    $validator.focusInvalid();
                    return false;
                }
            },

            onInit: function (tab: any, navigation: any, index: any) {

                $('[name="phone"]').intlTelInput();

                // check number of tabs and fill the entire row
                const $total = navigation.find('li').length;
                let $width = 100 / $total;
                const $wizard = navigation.closest('.wizard-card');

                const $display_width = $(document).width();

                if ($display_width < 600 && $total > 3) {
                    $width = 50;
                }

                navigation.find('li').css('width', $width + '%');
            },

            onTabClick: function (tab: any, navigation: any, index: any) {

                const $wizard = navigation.find('li');
                const $valid = $('.wizard-card form').valid();

                if (!$valid) {
                    return false;
                }
                else {
                    return true;
                }
            },

            onTabShow: function (tab: any, navigation: any, index: any) {
                const $total = navigation.find('li').length;
                let $current = index + 1;
                var $percent = ($current / $total) * 100;

                const $wizard = navigation.closest('.wizard-card');

                // If it's the last tab then hide the last button and show the finish instead
                if ($current >= $total) {
                    $($wizard).find('.btn-next').hide();
                    $($wizard).find('.btn-finish').show();
                } else {
                    $($wizard).find('.btn-next').show();
                    $($wizard).find('.btn-finish').hide();
                }

                $('.wizard-card .progress-bar').css({ width: $percent + '%' });
            }
        });

        firebase.auth().languageCode = 'en';

        this.windowRef = this.reg.windowRef;
        this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
            'size': 'normal'
        });
        this.windowRef.recaptchaVerifier.render();
    }

    onSubmit(values: Object) {
        const $valid = $('.wizard-card form').valid();
        if ($valid) {
            const appVerifier = this.windowRef.recaptchaVerifier;
            values['phone'] = $('[name="phone"]').intlTelInput('getNumber');
            firebase.auth().signInWithPhoneNumber(values['phone'], appVerifier)
                .then((result) => {
                    this.windowRef.confirmationResult = result;
                    if (this.windowRef.confirmationResult) {
                        this.registrationComplete = true;
                        // swal({
                        //     title: 'Enter your Verification Code Here',
                        //     input: 'password',
                        //     showCancelButton: false,
                        //     confirmButtonText: 'Verify',
                        //     showLoaderOnConfirm: true,
                        //     preConfirm: (code) => {
                        //     return new Promise((resolve, reject) => {
                        //         this.windowRef.confirmationResult.confirm(code)
                        //         .then((result) => {
                        //             resolve(result);
                        //         })
                        //         .catch((error) => {
                        //             reject(error);
                        //         })
                        //     });
                        //     },
                        //     allowOutsideClick: false
                        // })
                        // .then((result) => {
                        //     swal({
                        //         type: 'success',
                        //         title: 'You have successfully registered with your phone number !'
                        //     });
                        //     values['uuid'] = result.user.uid;
                        //     this.reg.saveUser(values).subscribe((data) => {
                        //         this.router.navigate(['/login']);
                        //     },(err) => {
                        //         swal(
                        //             'Oops...',
                        //             err.message,
                        //             'error'
                        //         );
                        //     });
                        // })
                        // .catch((error) => {
                        //     swal(
                        //         'Oops...',
                        //         error.message,
                        //         'error'
                        //     )
                        // })
                    }
                })
                .catch((error) => {
                    swal(
                        'Oops...',
                        error.message,
                        'error'
                    )
                });
        } else {
            swal('Error', 'Please check the Registration form for errors', 'error');
        }
    }

    verifyLoginCode(code) {
        let values = this.tradersRegForm.value;
        this.windowRef.confirmationResult.confirm(code)
            .then((result) => {
                swal({
                    type: 'success',
                    title: 'You have successfully registered with your phone number !'
                });
                values['uuid'] = result.user.uid;
                this.reg.saveUser(values).subscribe((data) => {
                    this.router.navigate(['/login']);
                }, (err) => {
                    swal(
                        'Oops...',
                        err.message,
                        'error'
                    );
                });
            })
            .catch((error) => {
            })
    }

    gotoLogin(){
        this.router.navigate(['/login']);
    }
}
