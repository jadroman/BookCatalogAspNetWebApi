import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/interfaces/category/category.model';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.css']
})
export class CategoryDetailsComponent implements OnInit {

  public category!: Category;

  constructor(private repository: RepositoryService, private router: Router, 
              private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.getOwnerDetails()
  }

  getOwnerDetails = () => {
    let id: string = this.activeRoute.snapshot.params['id'];
    let apiUrl: string = `api/category/${id}`;
    this.repository.getData(apiUrl)
    .subscribe(res => {
      this.category = res.body as Category;
    })
  }

  public redirectToCategoryList = () => {
    this.router.navigate(['/category/list']);
  }
}
