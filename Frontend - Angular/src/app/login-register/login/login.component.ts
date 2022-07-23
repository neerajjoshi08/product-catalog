import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user.service';
import { LoginRegisterService } from '../services/login-register.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  message: string = "";
  submitted: boolean = false;
  loginForm = {} as FormGroup;
  alertType: string = "";
  logged: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private loginRegisterService: LoginRegisterService,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  get loginFormControl() {
    return this.loginForm.controls;
  }

  // On submit of the user details
  onSubmit(): void {
    this.submitted = true;
    const { email, password, ...rest } = this.loginForm.value;
    let user = {} as User;
    user.email = email;
    user.password = password;

    if (this.loginForm.valid) {
      setTimeout(() => {
        this.loginRegisterService.loginUser(user).subscribe(() => {
          this.logged = true;
          this.message = "User successfully logged in. Redirecting to Dashboard";
          this.alertType = "success";
          setTimeout(() => {
            this.route.navigate(['product-search']);
          }, 2000);
        },
          (error: HttpErrorResponse) => {
            this.logged = true;

            this.alertType = "danger";
            if (error.status === 404) {
              this.message = "Invalid email or password";
            } else {
              this.message = "There is some problem, please try after some time";
            }
            setTimeout(() => {
              this.logged = false;
            }, 2000);
          }
        )

      }, 900);
    }
  }
}
