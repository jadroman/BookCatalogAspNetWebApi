import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ErrorHandlerService implements HttpInterceptor {
  public errorMessage: string = '';
 
  constructor(private _router: Router) { }
 
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = this.handleError(error);
        return throwError(errorMessage);
      })
    )
  }

  private handleError = (error: HttpErrorResponse) : string => {
    /* if(error.status === 500){
      this.handle500Error(error);
    }   */
    if(error.status === 400){
      return this.handleBadRequest(error);
    }
    else if(error.status === 404){
      return this.handle404Error(error)
    }
    else{
      return 'unknown error';
    }
  }
 
  /* private handle500Error = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
    this._router.navigate(['/500']);
  } */
 
  private handle404Error = (error: HttpErrorResponse) : string => {
    this._router.navigate(['/404']);  
    return error.message;
  }
 
  private handleBadRequest = (error: HttpErrorResponse): string => {
    if(this._router.url === '/authentication/register'){
      let message = '';
      const values = Object.values(error.error.errors);
      values.map((m: any) => {
         message += m + '<br>';
      })
      return message.slice(0, -4);
    }
    else{
      return error.error ? error.error : error.message;
    }
  }
/* 
  private handleOtherError = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
    //TODO: this will be fixed later;
  }
 
  private createErrorMessage = (error: HttpErrorResponse) => {
    this.errorMessage = error.error ? error.error : error.statusText;
  } */
}
