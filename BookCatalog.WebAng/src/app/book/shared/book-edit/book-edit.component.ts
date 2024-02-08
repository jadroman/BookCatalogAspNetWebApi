import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BookForCommit } from 'src/app/interfaces/book/book-for-commit.model';
import { Category } from 'src/app/interfaces/category/category.model';

@Component({
  selector: 'app-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.css']
})
export class BookEditComponent implements OnInit, OnChanges {
  public bookForm!: UntypedFormGroup;

  @Input() categories?:Category[];
  @Input() bookToUpdate?:BookForCommit;
  @Output() commitBookRequest = new EventEmitter<BookForCommit>();
  @Output() cancelEditRequest = new EventEmitter();
  
  constructor() { }

  ngOnInit(): void {
    this.bookForm = new UntypedFormGroup({
      title: new UntypedFormControl('', [Validators.required, Validators.maxLength(200)]),
      author: new UntypedFormControl('', [Validators.maxLength(56)]),
      year: new UntypedFormControl('', [Validators.max((new Date()).getFullYear())]),
      publisher: new UntypedFormControl('', [Validators.maxLength(56)]),
      collection: new UntypedFormControl('', [Validators.maxLength(56)]),
      read: new UntypedFormControl('', []),
      category: new UntypedFormControl('', []),
      note: new UntypedFormControl('', [Validators.maxLength(1000)])
    });

    this.bookForm.patchValue({
      read: "false",
      category: 0
    });
  }

  ngOnChanges(){
    if(this.bookToUpdate != null){
      this.bookForm.patchValue(this.bookToUpdate)
      this.bookForm.patchValue({
        category:  (this.bookToUpdate.categoryId != null) ? this.bookToUpdate.categoryId : 0
      });
    }
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

  
  public commitBook = (bookFormValue: any) => {
    if (this.bookForm.valid) {
      const book: BookForCommit = {
        title: bookFormValue.title,
        author: bookFormValue.author,
        note: bookFormValue.note,
        publisher: bookFormValue.publisher,
        read: bookFormValue.read,
        year: bookFormValue.year,
        collection: bookFormValue.collection,
        categoryId: (bookFormValue.category != 0) ? bookFormValue.category : null
      }

      this.commitBookRequest.emit(book);
    }
  }

  public cancelEdit() {
    this.cancelEditRequest.emit();
  }
}
