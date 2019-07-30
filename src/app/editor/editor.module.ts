import { NgModule } from '@angular/core';
import { EditorComponent } from './editor.component';
import { CommonModule } from '@angular/common';
import { Ng2PanZoomModule } from 'ng2-panzoom';
import { RouterModule } from '@angular/router';
import { EmployeeComponent } from './components/employee/employee.component';
import { ApiModule } from '../api/api.module';
import { MatFormFieldModule, MatAutocompleteModule, MatSliderModule, MatDatepickerModule, MatButtonModule, MatNativeDateModule, MatInputModule, MatTooltipModule, MatDialogModule, MatSelectModule, MatIconModule, MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmEmployeeDeleteDialogComponent } from './dialogs/confirm-employee-delete.component';
import { EmployeeRolestatsDialogComponent } from './dialogs/employee-role-stats-dialog.component';
import { ConfirmDeleteRoleDialogComponent } from './dialogs/confirm-delete-role-dialog.component';
import { DDMMYYYFormat } from '../util/constants/date-format';
import { UtilModule } from '../util/util.module';

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
    ApiModule,
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DDMMYYYFormat },
  ],
  entryComponents: [
    ConfirmEmployeeDeleteDialogComponent,
    EmployeeRolestatsDialogComponent,
    ConfirmDeleteRoleDialogComponent,
  ],
  declarations: [
    EmployeeComponent,
    EditorComponent,
    ConfirmEmployeeDeleteDialogComponent,
    EmployeeRolestatsDialogComponent,
    ConfirmDeleteRoleDialogComponent,
  ]
})
export class EditorModule {}
