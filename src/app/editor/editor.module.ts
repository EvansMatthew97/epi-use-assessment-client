import { NgModule } from '@angular/core';
import { EditorComponent } from './editor.component';
import { CommonModule } from '@angular/common';
import { Ng2PanZoomModule } from 'ng2-panzoom';
import { RouterModule } from '@angular/router';
import { EmployeeComponent } from './components/employee/employee.component';
import { ApiModule } from '../api/api.module';
import { MatFormFieldModule, MatAutocompleteModule, MatSliderModule, MatDatepickerModule, MatButtonModule, MatNativeDateModule, MatInputModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    RouterModule.forChild([{
      path: '',
      component: EditorComponent,
    }]),
    CommonModule,
    FormsModule,
    Ng2PanZoomModule,

    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSliderModule,
    MatDatepickerModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,

    ApiModule,
  ],
  providers: [],
  declarations: [
    EmployeeComponent,
    EditorComponent,
  ]
})
export class EditorModule {}
