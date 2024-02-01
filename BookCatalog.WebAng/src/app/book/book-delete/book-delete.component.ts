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

  public book!: Book;

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
      })
  }

  public redirectToBookList = () => {
    this.router.navigate(['/book/list']);
  }

  public deleteBook = () => {
    const deleteUrl: string = `api/book/Delete`;

    this.repository.delete(deleteUrl, { id: this.book.id })
      .subscribe(res => {
        this.redirectToBookList();
      })
  }

}
