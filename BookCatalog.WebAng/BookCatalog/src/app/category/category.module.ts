import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryListComponent } from './category-list/category-list.component';
import { RouterModule } from '@angular/router';
import { CategoryDetailsComponent } from './category-details/category-details.component';
import { CategoryCreateComponent } from './category-create/category-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    CategoryListComponent,
    CategoryDetailsComponent,
    CategoryCreateComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: CategoryListComponent },
      { path: 'list', component: CategoryListComponent },
      { path: 'create', component: CategoryCreateComponent },
      { path: 'details/:id', component: CategoryDetailsComponent }
    ]),
    ReactiveFormsModule
  ]
})
export class CategoryModule { }
