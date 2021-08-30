import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserForRegistration } from 'src/app/interfaces/user/userForRegistration.model';
import { PasswordConfirmationValidatorService } from 'src/app/shared/custom-validators/password-confirmation-validator.service';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {
  public registerForm!: FormGroup;  

  constructor(private _authService: AuthenticationService, 
              private _passConfValidator: PasswordConfirmationValidatorService,
              private _router: Router) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.maxLength(56)]),
      lastName: new FormControl('', [Validators.maxLength(56)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.maxLength(56)]),
      confirm: new FormControl('')
    });

    this.registerForm.get('confirm')!.setValidators([Validators.required,
      this._passConfValidator.validateConfirmPassword(this.registerForm.get('password')!)]);
  }

  public isInvalid = (controlName: string) => {
    return this.registerForm.controls[controlName].invalid && this.registerForm.controls[controlName].touched
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.registerForm.controls[controlName].hasError(errorName)
  }

  public registerUser = (registerFormValue: any) => {
    const formValues = { ...registerFormValue };

    const user: UserForRegistration = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      password: formValues.password,
      confirmPassword: formValues.confirm
    };
    
    this._authService.registerUser("api/accounts/registration", user)
      .subscribe(_ => {
        this._router.navigate(["/authentication/login"]);
      })
  }

}
