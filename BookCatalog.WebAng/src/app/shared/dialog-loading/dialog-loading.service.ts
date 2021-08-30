import { Injectable } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { DialogLoadingComponent } from "./dialog-loading.component";

@Injectable()
export class DialogLoadingService {
  private opened = false;
  private dialogRef!: MatDialogRef<DialogLoadingComponent>;

  constructor(private dialog: MatDialog) {}

  openDialog(): void {
    if (!this.opened) {
      this.opened = true;
      this.dialogRef = this.dialog.open(DialogLoadingComponent, {
        data: undefined,
        maxHeight: "100%",
        width: "400px",
        maxWidth: "100%",
        disableClose: true,
        hasBackdrop: true
      });

      this.dialogRef.afterClosed().subscribe(() => {
        this.opened = false;
      });
    }
  }

  hideDialog() {
    this.dialogRef.close();
  }
}