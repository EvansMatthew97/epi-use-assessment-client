import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { EmployeeRole } from '../../employee/interfaces/employee-role.interface';

/**
 * Format of data passed to confirm delete role dialog
 */
export interface ConfirmDeleteRoleDialogData {
  roles: EmployeeRole[];
}

/**
 * Dialog for confirm deletion of employee role.
 * Gives options for selecting the replacement role.
 */
@Component({
  selector: 'app-confirm-delete-role-dialog',
  template: `
  <h1 mat-dialog-title>Delete role</h1>
  <div mat-dialog-control>
    <p>This operation cannot be undone</p>
    <p>Deleting a role requires it be replaced by another role.</p>
    <mat-form-field>
      <mat-label>Replace role with</mat-label>
      <mat-select [(ngModel)]="selectedRole">
        <mat-option *ngFor="let role of data.roles" [value]="role.id">
          {{ role.name }}
        </mat-option>
      </mat-select>
    </mat-form-field>
    <!-- material selection -->
  </div>
  <div mat-dialog-actions>
    <button mat-button [mat-dialog-close]="false">Cancel</button>
    <button mat-button color="warn" [mat-dialog-close]="selectedRole">Delete</button>
  </div>
  `,
})
export class ConfirmDeleteRoleDialogComponent {
  selectedRole = this.data.roles[0].id;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: ConfirmDeleteRoleDialogData,
  ) {}


}
