import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Category } from 'src/app/interfaces/category.model';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  public categories: Category[] = []; 
  public errorMessage: string = '';

  currentIndex = -1;
  page = 1;
  count = 0;
  pageSize = 5;
  pageSizes = [5, 10, 15];

  constructor(private repository: RepositoryService, private errorHandler: ErrorHandlerService, 
    private router: Router, private SpinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getAllCategories();
  }


  getRequestParams(page: number, pageSize: number): any {
    let params: any = {};

    if (page) {
      params[`PageNumber`] = page - 1;
    }

    if (pageSize) {
      params[`PageSize`] = pageSize;
    }

    return params;
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.getAllCategories();
  }

  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getAllCategories();
  }

  public getAllCategories = () => {
    this.SpinnerService.show(); 
    const params = this.getRequestParams(this.page, this.pageSize);
    let apiAddress: string = "api/category";
    this.repository.getData(apiAddress, params)
      .subscribe((res:any) => {
        const { items, totalCount } = res.body;
        this.categories = items as Category[];
        this.count = totalCount;
        this.SpinnerService.hide(); 
      },
      (error) => {
        /* this.errorHandler.handleError(error);
        this.errorMessage = this.errorHandler.errorMessage; */
        this.SpinnerService.hide();
      })
  }

  public getCategoryDetails = (id: any) => { 
    const detailsUrl: string = `/category/details/${id}`; 
    this.router.navigate([detailsUrl]); 
  }

  public redirectToUpdatePage = (id: any) => {
    const updateUrl: string = `/category/update/${id}`;
    this.router.navigate([updateUrl]);
  }

  public redirectToDeletePage = (id: any) => { 
    const deleteUrl: string = `/category/delete/${id}`; 
    this.router.navigate([deleteUrl]); 
  }
  
}
