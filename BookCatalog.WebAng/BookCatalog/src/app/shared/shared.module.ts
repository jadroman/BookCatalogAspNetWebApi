import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorModalComponent } from './modals/error-modal/error-modal.component';
import { SuccessModalComponent } from './modals/success-modal/success-modal.component';
import { DigitOnlyDirective } from './helpers/digit-only.directive';



@NgModule({
  declarations: [
    ErrorModalComponent,
    SuccessModalComponent,
    DigitOnlyDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ErrorModalComponent,
    SuccessModalComponent,
    DigitOnlyDirective
  ]
})
export class SharedModule { }
