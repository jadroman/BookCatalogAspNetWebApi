import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
  public registerForm!: UntypedFormGroup;  

  constructor(private _authService: AuthenticationService, 
              private _passConfValidator: PasswordConfirmationValidatorService,
              private _router: Router) { }

  ngOnInit(): void {
    this.registerForm = new UntypedFormGroup({
      firstName: new UntypedFormControl('', [Validators.maxLength(56)]),
      lastName: new UntypedFormControl('', [Validators.maxLength(56)]),
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
      password: new UntypedFormControl('', [Validators.required, Validators.maxLength(56)]),
      confirm: new UntypedFormControl('')
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
