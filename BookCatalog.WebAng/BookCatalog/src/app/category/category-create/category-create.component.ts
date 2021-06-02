import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryForCreation } from 'src/app/interfaces/category-for-creation.mode';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.css']
})
export class CategoryCreateComponent implements OnInit {
  public errorMessage: string = '';
  public categoryForm!: FormGroup;
  constructor(private repository: RepositoryService, private errorHandler: ErrorHandlerService, private router: Router) { }
  ngOnInit() {
    this.categoryForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(60)])
    });
  }
  public isInvalid = (controlName: string) => {
    if (this.categoryForm.controls[controlName].invalid && this.categoryForm.controls[controlName].touched)
      return true;

    return false;
  }
  public hasError = (controlName: string, errorName: string) => {
    if (this.categoryForm.controls[controlName].hasError(errorName))
      return true;

    return false;
  }

  public createCategory = (categoryFormValue: any) => {
    if (this.categoryForm.valid) {
      this.executeCategoryCreation(categoryFormValue);
    }
  }
  private executeCategoryCreation = (categoryFormValue: { name: any; }) => {
    const category: CategoryForCreation = {
      name: categoryFormValue.name
    }
    const apiUrl = 'api/category';
    this.repository.create(apiUrl, category)
      .subscribe(res => {
        $('#successModal').modal();
      },
        (error => {
          $('#errorModal').modal();
          this.errorHandler.handleError(error);
          this.errorMessage = this.errorHandler.errorMessage;
        })
      )
  }
  public redirectToCategoryList() {
    this.router.navigate(['/category/list']);
  }
}
