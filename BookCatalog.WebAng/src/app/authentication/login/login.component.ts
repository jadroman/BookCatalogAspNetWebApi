import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
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
  public errorMessage: string = '';
  public showError!: boolean;
  private _returnUrl!: string;

  constructor(private _authService: AuthenticationService, private _router: Router, 
    private _route: ActivatedRoute, private SpinnerService: NgxSpinnerService) { }

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
    this.SpinnerService.show(); 
    this.showError = false;
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
        this.SpinnerService.hide(); 
      },
        (error) => {
          this.errorMessage = "Unexpected error occurred, sorry for the inconvenience.";
          this.showError = true;
          this.SpinnerService.hide(); 
        })
  }

}
