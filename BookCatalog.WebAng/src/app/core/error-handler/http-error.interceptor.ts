import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, finalize } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import { DialogInfoService } from "src/app/shared/dialog-info/dialog-info.service";
import { DialogLoadingService } from "src/app/shared/dialog-loading/dialog-loading.service";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private infoDialogService: DialogInfoService,
    private loadingDialogService: DialogLoadingService
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loadingDialogService.openDialog();
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errMsg: string = 'Unexpected error occurred, sorry for the inconvenience.';

        if (error.status === 401) {
          errMsg = error.error.errorMessage;
        }

        this.infoDialogService.openDialog(errMsg);
        return throwError(error);
      }),
      finalize(() => {
        this.loadingDialogService.hideDialog();
      })
    ) as Observable<HttpEvent<any>>;
  }
}