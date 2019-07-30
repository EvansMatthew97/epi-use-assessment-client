import { NgModule } from '@angular/core';
import { EditorComponent } from './editor.component';
import { CommonModule } from '@angular/common';
import { Ng2PanZoomModule } from 'ng2-panzoom';
import { RouterModule } from '@angular/router';
import { EmployeeComponent } from './components/employee/employee.component';
import {
  MatFormFieldModule,
  MatAutocompleteModule,
  MatSliderModule,
  MatDatepickerModule,
  MatButtonModule,
  MatNativeDateModule,
  MatInputModule,
  MatTooltipModule,
  MatDialogModule,
  MatSelectModule,
  MatIconModule,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
  DateAdapter
} from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmEmployeeDeleteDialogComponent } from './dialogs/confirm-employee-delete.component';
import { EmployeeRolestatsDialogComponent } from './dialogs/employee-role-stats-dialog.component';
import { ConfirmDeleteRoleDialogComponent } from './dialogs/confirm-delete-role-dialog.component';
import { DDMMYYYFormat } from '../util/constants/date-format';
import { UtilModule } from '../util/util.module';
import { EmployeeModule } from '../employee/employee.module';
import { EmployeeEditorComponent } from './components/employee-editor/employee-editor.component';

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
    MatSelectModule,
    MatIconModule,

    UtilModule,
    EmployeeModule,
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DDMMYYYFormat },
  ],
  entryComponents: [
    EmployeeEditorComponent,
    ConfirmEmployeeDeleteDialogComponent,
    EmployeeRolestatsDialogComponent,
    ConfirmDeleteRoleDialogComponent,
  ],
  declarations: [
    EmployeeComponent,
    EditorComponent,
    EmployeeEditorComponent,
    ConfirmEmployeeDeleteDialogComponent,
    EmployeeRolestatsDialogComponent,
    ConfirmDeleteRoleDialogComponent,
  ]
})
export class EditorModule {}
