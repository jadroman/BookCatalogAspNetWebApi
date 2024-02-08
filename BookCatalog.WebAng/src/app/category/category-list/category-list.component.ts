import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Category } from 'src/app/interfaces/category/category.model';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  public categories: Category[] = []; 
  public searchForm!: UntypedFormGroup;
  currentIndex = -1;
  page = 1;
  count = 0;
  pageSize = 5;
  name = '';
  pageSizes = [5, 10, 15];

  constructor(private repository: RepositoryService, 
    private router: Router) { }

  ngOnInit(): void {
    this.searchForm = new UntypedFormGroup({
      searchTerm: new UntypedFormControl('', [Validators.maxLength(200)]),
      searchBy:new UntypedFormControl('', [])
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
    const params = this.getRequestParams(this.page, this.pageSize, this.name);
    let apiAddress: string = "api/category";
    this.repository.getData(apiAddress, params)
      .subscribe((res:any) => {
        const { items, metaData } = res.body;
        this.categories = items as Category[];
        this.count = metaData.totalCount;
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
