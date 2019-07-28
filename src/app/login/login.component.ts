import { Component, Input } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../api/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  formGroup: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  @Input() error = null;

  constructor(
    private readonly api: ApiService,
  ) {}

  /**
   * Attempt to log the user in. If the credentials are wrong,
   * changes the error to reflect.
   */
  async submit() {
    if (!this.formGroup.valid) {
      this.error = 'Please enter username and password';
      return false; // prevent redirect
    }

    try {
      const result = await this.api.logIn(
        this.formGroup.get('username').value,
        this.formGroup.get('password').value,
      );

      if (!result) {
        this.error = 'Invalid credentials';
      }
    } catch (error) {
      console.error(error);
      this.error = 'An unknown error occurred';
    }

    return false; // prevent redirect
  }
}
