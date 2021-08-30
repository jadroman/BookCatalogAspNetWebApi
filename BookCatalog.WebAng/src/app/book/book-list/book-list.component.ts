import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/interfaces/book/book.model';
import { RepositoryService } from 'src/app/shared/services/repository.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {

  public books: Book[] = []; 
  public searchForm!: FormGroup;

  currentIndex = -1;
  page = 1;
  count = 0;
  pageSize = 5;
  title = '';
  author = '';
  pageSizes = [5, 10, 15];

  constructor(private repository: RepositoryService, 
    private router: Router) { }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      searchTerm: new FormControl('', [Validators.maxLength(200)]),
      searchBy:new FormControl('', [])
    });

    this.searchForm.patchValue({
      searchBy:  "title"
    });

    this.getAllBooks();
  }

  public searchBooks = (searchFormValue: any) => { 

    if(searchFormValue.searchBy === "title"){
      this.author = '';
      this.title = searchFormValue.searchTerm;
    }

    else if(searchFormValue.searchBy === "author")  {
      this.title = '';
      this.author = searchFormValue.searchTerm;
    }

    this.getAllBooks();
  }

  getRequestParams(page: number, pageSize: number, title?: string, author?: string): any {
    let params: any = {};

    if (page) {
      params[`PageNumber`] = page - 1;
    }

    if (pageSize) {
      params[`PageSize`] = pageSize;
    }
    
    if (title) {
      params[`title`] = title;
    }

    if (author) {
      params[`author`] = author;
    }

    return params;
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.getAllBooks();
  }

  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getAllBooks();
  }

  public getAllBooks = () => {
    //this.SpinnerService.show(); 
    const params = this.getRequestParams(this.page, this.pageSize, this.title, this.author);
    let apiAddress: string = "api/book";
    this.repository.getData(apiAddress, params)
      .subscribe((res:any) => {
        const { items, metaData } = res.body;
        this.books = items as Book[];
        this.count = metaData.totalCount;
        //this.SpinnerService.hide(); 
      })
  }

  public getBookDetails = (id: any) => { 
    const detailsUrl: string = `/book/details/${id}`; 
    this.router.navigate([detailsUrl]); 
  }

  public redirectToUpdatePage = (id: any) => {
    const updateUrl: string = `/book/update/${id}`;
    this.router.navigate([updateUrl]);
  }

  public redirectToDeletePage = (id: any) => { 
    const deleteUrl: string = `/book/delete/${id}`; 
    this.router.navigate([deleteUrl]); 
  }
}
