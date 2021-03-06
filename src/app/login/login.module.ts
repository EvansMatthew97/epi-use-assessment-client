import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';

import { MatFormFieldModule, MatInputModule, MatButtonModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiModule } from '../api/api.module';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: LoginComponent,
      },
    ]),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,

    ApiModule,
  ],
  declarations: [
    LoginComponent,
  ],
  entryComponents: [
    LoginComponent,
  ],
  providers: [],
})
export class LoginModule {}
