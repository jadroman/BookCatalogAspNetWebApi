import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/interfaces/book/book.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { RepositoryService } from 'src/app/shared/services/repository.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {

  public books: Book[] = []; 
  public errorMessage: string = '';

  currentIndex = -1;
  page = 1;
  count = 0;
  pageSize = 5;
  pageSizes = [5, 10, 15];

  constructor(private repository: RepositoryService, private errorHandler: ErrorHandlerService, 
    private router: Router, private SpinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getAllBooks();
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
    this.getAllBooks();
  }

  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getAllBooks();
  }

  public getAllBooks = () => {
    this.SpinnerService.show(); 
    const params = this.getRequestParams(this.page, this.pageSize);
    let apiAddress: string = "api/book";
    this.repository.getData(apiAddress, params)
      .subscribe((res:any) => {
        const { items, totalCount } = res.body;
        this.books = items as Book[];
        this.count = totalCount;
        this.SpinnerService.hide(); 
      },
      (error) => {
        /* this.errorHandler.handleError(error);
        this.errorMessage = this.errorHandler.errorMessage; */
        this.SpinnerService.hide();
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
