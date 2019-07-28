import { NgModule } from '@angular/core';
import { EditorComponent } from './editor.component';
import { CommonModule } from '@angular/common';
import { Ng2PanZoomModule } from 'ng2-panzoom';
import { RouterModule } from '@angular/router';
import { EmployeeComponent } from './components/employee/employee.component';

@NgModule({
  imports: [
    RouterModule.forChild([{
      path: '',
      component: EditorComponent,
    }]),
    CommonModule,
    Ng2PanZoomModule,
  ],
  providers: [],
  declarations: [
    EmployeeComponent,
    EditorComponent,
  ]
})
export class EditorModule {}
