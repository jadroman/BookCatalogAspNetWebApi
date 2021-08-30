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

  public category!: Category;
  
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
      })
  }
}
