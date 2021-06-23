import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from 'src/app/interfaces/book/book.model';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {

  public book!: Book;
  public errorMessage: string = '';
  constructor(private repository: RepositoryService, private router: Router, 
              private activeRoute: ActivatedRoute, private errorHandler: ErrorHandlerService) { }

  ngOnInit() {
    this.getOwnerDetails()
  }

  getOwnerDetails = () => {
    let id: string = this.activeRoute.snapshot.params['id'];
    let apiUrl: string = `api/book/${id}`;
    this.repository.getData(apiUrl)
    .subscribe(res => {
      this.book = res.body as Book;
    },
    (error) =>{
      /* this.errorHandler.handleError(error);
      this.errorMessage = this.errorHandler.errorMessage; */
    })
  }

  public redirectToBookList = () => {
    this.router.navigate(['/book/list']);
  }
}
