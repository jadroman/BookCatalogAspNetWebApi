import { ErrorHandler, Injectable, NgZone } from "@angular/core";
import { DialogInfoService } from "src/app/shared/dialog-info/dialog-info.service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private errorDialogService: DialogInfoService, private zone: NgZone) {}

  handleError(error: Error) {

    this.zone.run(() =>
      this.errorDialogService.openDialog(
        error.message || "Undefined client error"
    ));
  }
}