import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DialogInfoComponent } from "./dialog-info.component";

@Injectable()
export class DialogInfoService {
  private opened = false;

  constructor(private dialog: MatDialog) {}

  openDialog(message: string): void {
    if (!this.opened) {
      this.opened = true;
      const dialogRef = this.dialog.open(DialogInfoComponent, {
        data: { message },
        maxHeight: "100%",
        width: "540px",
        maxWidth: "100%",
        disableClose: true,
        hasBackdrop: true
      });

      dialogRef.afterClosed().subscribe(() => {
        this.opened = false;
      });
    }
  }
}