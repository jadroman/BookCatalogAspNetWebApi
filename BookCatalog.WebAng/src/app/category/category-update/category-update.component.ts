import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryForCommit } from 'src/app/interfaces/category/category-for-commit.model';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-category-update',
  templateUrl: './category-update.component.html',
  styleUrls: ['./category-update.component.css']
})
export class CategoryUpdateComponent implements OnInit {
  public category!: CategoryForCommit;
  public categoryForm!: FormGroup;

  constructor(private repository: RepositoryService, private router: Router,
    private activeRoute: ActivatedRoute) { }
    
    ngOnInit() {    
      this.getCategoryById();
    }

    private getCategoryById = () => {
      let categoryId: string = this.activeRoute.snapshot.params['id'];
        
      let categoryByIdUrl: string = `api/category/${categoryId}`;
    
      this.repository.getData(categoryByIdUrl)
        .subscribe(res => {
          this.category = res.body as CategoryForCommit;
        })
    }

    public redirectToCategoryList = () => {
      this.router.navigate(['/category/list']);
    }

    public executeCategoryUpdate = (categoryFormValue: { name: string; }) => {
      this.category.name = categoryFormValue.name;
    
      let apiUrl = `api/category/${this.category.id}`;
      this.repository.update(apiUrl, this.category)
        .subscribe(() => {
          this.redirectToCategoryList();
        }
      )
    }

}
