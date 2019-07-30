import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Employee } from 'src/app/editor/interfaces/employee.interface';

export interface ConfirmDeleteEmployeeData {
  employee: Employee;
}

@Component({
  selector: 'app-dialog-confirm-employee-delete',
  template: `
    <h1 mat-dialog-title>Really delete employee?</h1>
    <div mat-dialog-content>
      <p>Employee <b>{{ data.employee.name }} {{ data.employee.surname }}</b> will be deleted permanently.</p>
      <p>This action cannot be undone.</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="false">Cancel</button>
      <button mat-button color="warn" [mat-dialog-close]="true">Delete Employee</button>
    </div>
  `,
})
export class ConfirmEmployeeDeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmEmployeeDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDeleteEmployeeData,
  ) {}
}
