import { NgModule } from '@angular/core';
import { EditorComponent } from './editor.component';
import { CommonModule } from '@angular/common';
import { Ng2PanZoomModule } from 'ng2-panzoom';
import { RouterModule } from '@angular/router';
import { EmployeeComponent } from './components/employee/employee.component';
import { ApiModule } from '../api/api.module';
import { MatFormFieldModule, MatAutocompleteModule, MatSliderModule, MatDatepickerModule, MatButtonModule, MatNativeDateModule, MatInputModule, MatTooltipModule, MatDialogModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmEmployeeDeleteDialogComponent } from './dialogs/confirm-employee-delete.component';
import { EmployeeRolestatsDialogComponent } from './dialogs/employee-role-stats-dialog.component';

@NgModule({
  imports: [
    RouterModule.forChild([{
      path: '',
      component: EditorComponent,
    }]),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    Ng2PanZoomModule,

    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSliderModule,
    MatDatepickerModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatDialogModule,

    ApiModule,
  ],
  providers: [],
  entryComponents: [
    ConfirmEmployeeDeleteDialogComponent,
    EmployeeRolestatsDialogComponent,
  ],
  declarations: [
    EmployeeComponent,
    EditorComponent,
    ConfirmEmployeeDeleteDialogComponent,
    EmployeeRolestatsDialogComponent,
  ]
})
export class EditorModule {}
