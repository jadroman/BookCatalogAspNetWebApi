import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from 'src/app/interfaces/book/book.model';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {

  public book!: Book;
  public errorMessage: string = '';
  public showError!: boolean;

  constructor(private repository: RepositoryService, private router: Router, 
              private activeRoute: ActivatedRoute) { }

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
      // log the error
      this.errorMessage = "Unexpected error occurred, sorry for the inconvenience";
      this.showError = true;
    })
  }

  public redirectToBookList = () => {
    this.router.navigate(['/book/list']);
  }
}
