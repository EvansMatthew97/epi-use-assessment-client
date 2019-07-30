import { Component, Inject } from '@angular/core';
import { EmployeeRole } from '../../employee/interfaces/employee-role.interface';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Employee } from 'src/app/employee/interfaces/employee.interface';

export interface EmployeeRoleStatsDialogData {
  stats: Array<{
    role: EmployeeRole;
    employee: Employee;
  }>;
}

@Component({
  selector: 'app-dialog-employee-role-stats',
  template: `
    <h1 mat-dialog-title>Role statistics</h1>
    <div mat-dialog-content>
      <h3>Highest-earning salary per role</h3>
      <p>Excludes roles without any employees</p>
      <table>
        <tr>
          <th>Role</th>
          <th>Salary</th>
          <th>Name</th>
          <th>Empl. No.</th>
        </tr>
        <tr *ngFor="let stat of data.stats">
          <td><b>{{ stat.role.name }}</b></td>
          <td>{{ stat.employee.salary | currency:'R' }}</td>
          <td>{{ stat.employee.name }} {{ stat.employee.surname }}</td>
          <td>{{ stat.employee.id }}</td>
        </tr>
      </table>
    </div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="true">Close</button>
    </div>
  `,
  styles: [`
    th, td {
      text-align: left !important;
      padding: 10px;
    }
    tr:nth-child(odd) {
      background: #efefef;
    }
    tr:first-child, td:first-child {
      background: #ccc;
    }
  `]
})
export class EmployeeRolestatsDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: EmployeeRoleStatsDialogData,
  ) {}
}
