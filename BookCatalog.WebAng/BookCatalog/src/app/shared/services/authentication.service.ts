 

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentUrlService } from './environment-url.service';
import { UserBinding } from 'src/app/interfaces/user/UserBinding.model';
import { RegistrationResponseBinding } from 'src/app/interfaces/response/RegistrationResponseBinding.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private _http: HttpClient, private _envUrl: EnvironmentUrlService) { }

  public registerUser = (route: string, body: UserBinding) => {
    return this._http.post<RegistrationResponseBinding> (this.createCompleteRoute(route, this._envUrl.urlAddress), body);
  }

  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  }
}