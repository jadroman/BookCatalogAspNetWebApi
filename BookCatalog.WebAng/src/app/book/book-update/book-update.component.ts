import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookForCommit } from 'src/app/interfaces/book/book-for-commit.model';
import { Book } from 'src/app/interfaces/book/book.model';
import { Category } from 'src/app/interfaces/category/category.model';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-book-update',
  templateUrl: './book-update.component.html',
  styleUrls: ['./book-update.component.css']
})
export class BookUpdateComponent implements OnInit {

  public book!: BookForCommit;
  public categories!: Category[];


  constructor(private repository: RepositoryService, private router: Router,
    private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.getBookById();
  }

  private getBookById = () => {
    let bookId: string = this.activeRoute.snapshot.params['id'];

    let bookByIdUrl: string = `api/book/${bookId}`;

    this.repository.getData(bookByIdUrl)
      .subscribe(res => {
        this.book = res.body as Book;
        this.getCategories();
      })
  }


  private getCategories = () => {
    let categoryByUrl: string = `api/category`;

    this.repository.getData(categoryByUrl)
      .subscribe(res => {
        this.categories = res.body.items as Category[];
      })
  }

  public redirectToBookList = () => {
    this.router.navigate(['/book/list']);
  }

  public executeBookUpdate = (bookFormValue: BookForCommit) => {
    this.book!.title = bookFormValue.title;
    this.book!.author = bookFormValue.author;
    this.book!.note = bookFormValue.note;
    this.book!.publisher = bookFormValue.publisher;
    this.book!.read = bookFormValue.read;
    this.book!.year = bookFormValue.year;
    this.book!.collection = bookFormValue.collection;
    this.book!.categoryId = bookFormValue.categoryId;

    let apiUrl = `api/book/${this.book?.id}`;
    this.repository.update(apiUrl, this.book)
      .subscribe(() => {
        this.redirectToBookList();
      }
      )
  }

}
