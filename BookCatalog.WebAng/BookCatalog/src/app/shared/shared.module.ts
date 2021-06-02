import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorModalComponent } from './modals/error-modal/error-modal.component';
import { SuccessModalComponent } from './modals/success-modal/success-modal.component';



@NgModule({
  declarations: [
    ErrorModalComponent,
    SuccessModalComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ErrorModalComponent,
    SuccessModalComponent
  ]
})
export class SharedModule { }
