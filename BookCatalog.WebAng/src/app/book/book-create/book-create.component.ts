import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookForCommit } from 'src/app/interfaces/book/book-for-commit.model';
import { Category } from 'src/app/interfaces/category/category.model';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-book-create',
  templateUrl: './book-create.component.html',
  styleUrls: ['./book-create.component.css']
})
export class BookCreateComponent implements OnInit {

  public categories!: Category[]; 

  constructor(private repository: RepositoryService, private router: Router) { }

  ngOnInit() {
    this.getCategories();
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

  public executeBookCreation = (book: BookForCommit)  => {

    const apiUrl = 'api/book';

    this.repository.create(apiUrl, book)
      .subscribe(() => {
        this.redirectToBookList();
      })
  }
  

}
