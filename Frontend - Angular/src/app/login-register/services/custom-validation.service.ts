import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomValidationService {

  constructor() { }

  matchControls(firstControlName: string, secondControlName: string) {
    return (formGroup: FormGroup) => {
      const firstControl = formGroup.controls[firstControlName];
      const secondControl = formGroup.controls[secondControlName];

      if (!secondControl.errors && firstControl.value !== secondControl.value) {
        secondControl.setErrors({ mustMatch: true });

      }
    }
  }
}
