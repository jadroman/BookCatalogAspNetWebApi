import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryListComponent } from './category-list/category-list.component';
import { RouterModule } from '@angular/router';
import { CategoryDetailsComponent } from './category-details/category-details.component';



@NgModule({
  declarations: [
    CategoryListComponent,
    CategoryDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: CategoryListComponent },
      { path: 'list', component: CategoryListComponent },
      { path: 'details/:id', component: CategoryDetailsComponent }
    ])
  ]
})
export class CategoryModule { }
