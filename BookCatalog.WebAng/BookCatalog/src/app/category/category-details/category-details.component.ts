import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Category } from 'src/app/interfaces/category.model';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.css']
})
export class CategoryDetailsComponent implements OnInit {

  public category!: Category;
  public errorMessage: string = '';
  constructor(private repository: RepositoryService, private router: Router, 
              private activeRoute: ActivatedRoute, private errorHandler: ErrorHandlerService) { }

  ngOnInit() {
    this.getOwnerDetails()
  }

  getOwnerDetails = () => {
    let id: string = this.activeRoute.snapshot.params['id'];
    let apiUrl: string = `api/category/${id}`;
    this.repository.getData(apiUrl)
    .subscribe(res => {
      this.category = res.body as Category;
    },
    (error) =>{
      /* this.errorHandler.handleError(error);
      this.errorMessage = this.errorHandler.errorMessage; */
    })
  }

  public redirectToCategoryList = () => {
    this.router.navigate(['/category/list']);
  }
}
