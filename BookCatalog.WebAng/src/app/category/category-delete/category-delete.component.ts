import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/interfaces/category/category.model';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-category-delete',
  templateUrl: './category-delete.component.html',
  styleUrls: ['./category-delete.component.css']
})
export class CategoryDeleteComponent implements OnInit {

  public errorMessage: string = '';
  public category!: Category;
  public showError!: boolean;
  
constructor(private repository: RepositoryService, private router: Router,
  private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.getCategoryById();
  }
  
  private getCategoryById = () => {
    const categoryId: string = this.activeRoute.snapshot.params['id'];
    const categoryByIdUrl: string = `api/category/${categoryId}`;
  
    this.repository.getData(categoryByIdUrl)
      .subscribe(res => {
        this.category = res.body as Category;
      },
      (error) => {
        // log the error
        this.errorMessage = "Unexpected error occurred, sorry for the inconvenience";
        this.showError = true;
      })
  }
  
  public redirectToCategoryList = () => {
    this.router.navigate(['/category/list']);
  }
  
  public deleteCategory = () => {
    const deleteUrl: string = `api/category/${this.category.id}`;
    
    this.repository.delete(deleteUrl)
      .subscribe(res => {
        this.redirectToCategoryList();
      },
      (error) => {
        // log the error
        this.errorMessage = "Unexpected error occurred, sorry for the inconvenience";
        this.showError = true;
      })
  }
}
