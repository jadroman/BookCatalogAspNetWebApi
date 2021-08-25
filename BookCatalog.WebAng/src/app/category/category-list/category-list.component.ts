import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Category } from 'src/app/interfaces/category/category.model';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  public categories: Category[] = []; 
  public errorMessage: string = '';
  public searchForm!: FormGroup;
  public showError!: boolean;

  currentIndex = -1;
  page = 1;
  count = 0;
  pageSize = 5;
  name = '';
  pageSizes = [5, 10, 15];

  constructor(private repository: RepositoryService, 
    private router: Router, private SpinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      searchTerm: new FormControl('', [Validators.maxLength(200)]),
      searchBy:new FormControl('', [])
    });
    
    this.searchForm.patchValue({
      searchBy:  "name"
    });
    
    this.getAllCategories();
  }

  public searchCategories = (searchFormValue: any) => { 

    if(searchFormValue.searchBy === "name"){
      this.name = searchFormValue.searchTerm;
    }

    this.getAllCategories();
  }

  getRequestParams(page: number, pageSize: number, name?: string): any {
    let params: any = {};

    if (page) {
      params[`PageNumber`] = page - 1;
    }

    if (name) {
      params[`name`] = name;
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
    const params = this.getRequestParams(this.page, this.pageSize, this.name);
    let apiAddress: string = "api/category";
    this.repository.getData(apiAddress, params)
      .subscribe((res:any) => {
        const { items, metaData } = res.body;
        this.categories = items as Category[];
        this.count = metaData.totalCount;
        this.SpinnerService.hide(); 
      },
      (error) => {
        // log the error
        this.errorMessage = "Unexpected error occurred, sorry for the inconvenience";
        this.showError = true;
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
