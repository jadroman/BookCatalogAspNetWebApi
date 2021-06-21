import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from 'src/app/interfaces/book/book.model';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-book-delete',
  templateUrl: './book-delete.component.html',
  styleUrls: ['./book-delete.component.css']
})
export class BookDeleteComponent implements OnInit {

  public errorMessage: string = '';
  public book!: Book;
  
constructor(private repository: RepositoryService, private errorHandler: ErrorHandlerService, private router: Router,
  private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.getCategoryById();
  }
  
  private getCategoryById = () => {
    const bookId: string = this.activeRoute.snapshot.params['id'];
    const bookByIdUrl: string = `api/book/${bookId}`;
  
    this.repository.getData(bookByIdUrl)
      .subscribe(res => {
        this.book = res.body as Book;
      },
      (error) => {
        /* this.errorHandler.handleError(error);
        this.errorMessage = this.errorHandler.errorMessage; */
      })
  }
  
  public redirectToBookList = () => {
    this.router.navigate(['/book/list']);
  }
  
  public deleteBook = () => {
    const deleteUrl: string = `api/book/${this.book.id}`;
    
    this.repository.delete(deleteUrl)
      .subscribe(res => {
        this.redirectToBookList();
      },
      (error) => {
        /* this.errorHandler.handleError(error);
        this.errorMessage = this.errorHandler.errorMessage; */
      })
  }

}
