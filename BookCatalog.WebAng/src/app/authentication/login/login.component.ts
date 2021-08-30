import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthResponse } from 'src/app/interfaces/response/authResponse.model';
import { UserForAuthentication } from 'src/app/interfaces/user/userForAuthentication.model';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  private _returnUrl!: string;

  constructor(private _authService: AuthenticationService, private _router: Router, 
    private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required])
    })
    this._returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
  }

  public isInvalid = (controlName: string) => {
    return this.loginForm.controls[controlName].invalid && this.loginForm.controls[controlName].touched
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.loginForm.controls[controlName].hasError(errorName)
  }

  public loginUser = (loginFormValue: any) => {
    const login = { ...loginFormValue };
    const userForAuth: UserForAuthentication = {
      email: login.username,
      password: login.password
    }
    this._authService.loginUser('api/accounts/login', userForAuth)
      .subscribe(res => {
        let response = res as AuthResponse;
        localStorage.setItem("token", response.token);
        this._authService.sendAuthStateChangeNotification(response.isAuthSuccessful);
        this._router.navigate([this._returnUrl]);
      })
  }

}
