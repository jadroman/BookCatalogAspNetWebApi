import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryForCommit } from 'src/app/interfaces/category/category-for-commit.model';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.css']
})
export class CategoryCreateComponent implements OnInit {

  constructor(private repository: RepositoryService, private router: Router) { }

  ngOnInit() {
  }

  public executeCategoryCreation = (category: CategoryForCommit) => {
    const apiUrl = 'api/category';
    
    this.repository.create(apiUrl, category)
      .subscribe(res => {
        this.redirectToCategoryList();
      })
  }

  public redirectToCategoryList() {
    this.router.navigate(['/category/list']);
  }
}
