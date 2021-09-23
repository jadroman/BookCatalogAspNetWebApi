import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookListComponent } from './book-list/book-list.component';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReactiveFormsModule } from '@angular/forms';
import { BookDetailsComponent } from './book-details/book-details.component';
import { BookUpdateComponent } from './book-update/book-update.component';
import { BookCreateComponent } from './book-create/book-create.component';
import { BookDeleteComponent } from './book-delete/book-delete.component';
import { DigitOnlyDirective } from '../shared/helpers/digit-only.directive';
import { BookEditComponent } from './shared/book-edit/book-edit.component';



@NgModule({
  declarations: [
    BookListComponent,
    BookDetailsComponent,
    BookUpdateComponent,
    BookCreateComponent,
    BookDeleteComponent,
    DigitOnlyDirective,
    BookEditComponent
  ],
  imports: [
    NgxPaginationModule,  
    CommonModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    RouterModule.forChild([
      { path: '', component: BookListComponent },
      { path: 'list', component: BookListComponent },
      { path: 'details/:id', component: BookDetailsComponent },
      { path: 'update/:id', component: BookUpdateComponent },
      { path: 'create', component: BookCreateComponent },
      { path: 'delete/:id', component: BookDeleteComponent }
    ])
  ]
})
export class BookModule { }
