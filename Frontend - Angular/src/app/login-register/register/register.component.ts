import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user.service';
import { CustomValidationService } from '../services/custom-validation.service';
import { LoginRegisterService } from '../services/login-register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm = {} as FormGroup;
  submitted: boolean = false;
  registered: boolean = false;
  message: string = "";
  alertType: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private loginRegisterService: LoginRegisterService,
    private customValidationService: CustomValidationService,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    },
      {
        validator: this.customValidationService.matchControls('password', 'confirmPassword')
      }
    );
  }

  get registerFormControl() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    const { confirmPassword, ...rest } = this.registerForm.value;
    let user: User = rest;

    if (this.registerForm.valid) {
      setTimeout(() => {
        this.loginRegisterService.registerUser(user).subscribe(() => {
          this.registered = true;
          this.message = "User successfully registered. Redirecting to Login Page";
          this.alertType = "success";
          setTimeout(() => {
            this.route.navigate(['product-search']);
          }, 2000);
        },
          (error: HttpErrorResponse) => {
            this.registered = true;
            this.alertType = "danger";
            if (error.status === 409) {
              this.message = "User with same email already exist";
            } else {
              this.message = "There is some problem, please try after some time";
            }
            setTimeout(() => {
              this.registered = false;
            }, 2000);
          }
        )
      }, 1000);
    }
  }
}

