 import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentUrlService } from './environment-url.service';
import { UserForRegistration } from 'src/app/interfaces/user/userForRegistration.model';
import { RegistrationResponse } from 'src/app/interfaces/response/registrationResponse.model';
import { UserForAuthentication } from 'src/app/interfaces/user/userForAuthentication.model';
import { Subject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService { 
  private _authChangeSub = new Subject<boolean>()
  public authChanged = this._authChangeSub.asObservable();

  constructor(private _http: HttpClient, private _envUrl: EnvironmentUrlService, private _jwtHelper: JwtHelperService) { }

  public loginUser = (route: string, body: UserForAuthentication) => {
    return this._http.post(this.createCompleteRoute(route, this._envUrl.urlAddress), body);
  }

  public registerUser = (route: string, body: UserForRegistration) => {
    return this._http.post<RegistrationResponse> (this.createCompleteRoute(route, this._envUrl.urlAddress), body);
  }

  public sendAuthStateChangeNotification = (isAuthenticated: boolean) => {
    this._authChangeSub.next(isAuthenticated);
  }

  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  }

  public logout = () => {
    localStorage.removeItem("token");
    this.sendAuthStateChangeNotification(false);
  }

  public isUserAuthenticated = (): any => {
    const token = localStorage.getItem("token");
 
    return token && !this._jwtHelper.isTokenExpired(token);
  }
}