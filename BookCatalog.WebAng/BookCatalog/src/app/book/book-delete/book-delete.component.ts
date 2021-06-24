import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from 'src/app/interfaces/book/book.model';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-book-delete',
  templateUrl: './book-delete.component.html',
  styleUrls: ['./book-delete.component.css']
})
export class BookDeleteComponent implements OnInit {

  public errorMessage: string = '';
  public book!: Book;
  public showError!: boolean;
  
constructor(private repository: RepositoryService, private router: Router,
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
        // log the error
        this.errorMessage = "Unexpected error occurred, sorry for the inconvenience";
        this.showError = true;
      })
  }

}
