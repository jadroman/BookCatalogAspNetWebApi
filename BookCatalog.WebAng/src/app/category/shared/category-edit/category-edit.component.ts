import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { CategoryForCommit } from 'src/app/interfaces/category/category-for-commit.model';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.css']
})
export class CategoryEditComponent implements OnInit, OnChanges {
  public categoryForm!: UntypedFormGroup;

  @Input() categToUpdate?:CategoryForCommit;
  @Output() commitCategoryRequest = new EventEmitter<CategoryForCommit>();
  @Output() cancelEditRequest = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.categoryForm = new UntypedFormGroup({
      name: new UntypedFormControl('', [Validators.required, Validators.maxLength(60)])
    });
  }

  ngOnChanges(){
    if(this.categToUpdate != null){
      this.categoryForm.patchValue(this.categToUpdate)
    }
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

  public commitCategory = (categoryFormValue: any) => {
    if (this.categoryForm.valid) {
      const category: CategoryForCommit = {
        name: categoryFormValue.name
      }
      
      this.commitCategoryRequest.emit(category);
    }
  }

  public cancelEdit() {
    this.cancelEditRequest.emit();
  }

}
