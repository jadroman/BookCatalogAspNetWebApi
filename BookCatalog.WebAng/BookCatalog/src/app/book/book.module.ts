import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookListComponent } from './book-list/book-list.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    BookListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CommonModule,
    RouterModule.forChild([
      { path: '', component: BookListComponent },
      { path: 'list', component: BookListComponent }
      /* { path: 'create', component: CategoryCreateComponent },
      { path: 'details/:id', component: CategoryDetailsComponent },
      { path: 'update/:id', component: CategoryUpdateComponent },
      { path: 'delete/:id', component: CategoryDeleteComponent } */
    ]),
    ReactiveFormsModule,
    NgxPaginationModule,  
    NgxSpinnerModule
  ]
})
export class BookModule { }
