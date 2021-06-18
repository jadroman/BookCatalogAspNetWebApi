import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from 'src/app/interfaces/book/book.model';
import { Category } from 'src/app/interfaces/category.model';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-book-update',
  templateUrl: './book-update.component.html',
  styleUrls: ['./book-update.component.css']
})
export class BookUpdateComponent implements OnInit {

  public errorMessage: string = '';
  public book!: Book;
  public categories!: Category[];
  public bookForm!: FormGroup;
  constructor(private repository: RepositoryService, private errorHandler: ErrorHandlerService, private router: Router,
    private activeRoute: ActivatedRoute) { }
    
    ngOnInit() {
      this.bookForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.maxLength(200)]),
        author: new FormControl('', [Validators.maxLength(56)]),
        year: new FormControl('', [Validators.max((new Date()).getFullYear())]),
        publisher: new FormControl('', [Validators.maxLength(56)]),
        collection: new FormControl('', [Validators.maxLength(56)]),
        read: new FormControl('', []),
        category: new FormControl('', []),
        note: new FormControl('', [Validators.maxLength(1000)])
      });
    
      this.getBookById();
    }
    
    private getBookById = () => {
      let bookId: string = this.activeRoute.snapshot.params['id'];
        
      let bookByIdUrl: string = `api/book/${bookId}`;
    
      this.repository.getData(bookByIdUrl)
        .subscribe(res => {
          this.book = res.body as Book;
          this.bookForm.patchValue(this.book);
          this.getCategories();
        },
        (error) => {
          /* this.errorHandler.handleError(error);
          this.errorMessage = this.errorHandler.errorMessage; */
        })
    }

    
    private getCategories = () => {
      let categoryByUrl: string = `api/category`;
    
      this.repository.getData(categoryByUrl)
        .subscribe(res => {
          this.categories = res.body.items as Category[];
          this.bookForm.patchValue({
            category:  (this.book?.category != null) ? this.book?.category.id : 0
          });
        },
        (error) => {
          /* this.errorHandler.handleError(error);
          this.errorMessage = this.errorHandler.errorMessage; */
        })
    }

    public isInvalid = (controlName: string) => {
      if (this.bookForm.controls[controlName].invalid && this.bookForm.controls[controlName].touched)
        return true;
    
      return false;
    }
    
    public hasError = (controlName: string, errorName: string)  => {
      if (this.bookForm.controls[controlName].hasError(errorName))
        return true;
    
      return false;
    }
        
    public redirectToBookList = () => {
      this.router.navigate(['/book/list']);
    }

    public updateBook = (bookFormValue: any) => {
      if (this.bookForm.valid) {
        this.executeBookUpdate(bookFormValue);
      }
    }
    
    private executeBookUpdate = (bookFormValue: any) => {
      this.book!.title = bookFormValue.title;
      this.book!.author = bookFormValue.author;
      this.book!.note = bookFormValue.note;
      this.book!.publisher = bookFormValue.publisher;
      this.book!.read = bookFormValue.read;
      this.book!.year = bookFormValue.year;
      this.book!.collection = bookFormValue.collection;
      this.book!.category = this.categories.find(c => c.id == bookFormValue.category) as Category;
    
      let apiUrl = `api/book/${this.book?.id}`;
      this.repository.update(apiUrl, this.book)
        .subscribe(res => {
          this.redirectToBookList();
        },
        (error => {
          /* this.errorHandler.handleError(error);
          this.errorMessage = this.errorHandler.errorMessage; */
        })
      )
    }

}
