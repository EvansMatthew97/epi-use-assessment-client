import { Component, } from '@angular/core';
import { PanZoomConfig } from 'ng2-panzoom';
import { Employee } from '../employee/interfaces/employee.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeRole } from '../employee/interfaces/employee-role.interface';
import { MatDialog } from '@angular/material';
import { ConfirmEmployeeDeleteDialogComponent, ConfirmDeleteEmployeeData } from './dialogs/confirm-employee-delete.component';
import { EmployeeRolestatsDialogComponent } from './dialogs/employee-role-stats-dialog.component';
import { ConfirmDeleteRoleDialogComponent } from './dialogs/confirm-delete-role-dialog.component';
import { EmployeeService } from '../employee/employee.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
  // editor pan/zoom canvas configuration
  zoomConfig: PanZoomConfig = new PanZoomConfig({
    freeMouseWheelFactor: 0.01,
  });

  // the employee hierarchy
  hierarchy: Employee[] = [];
  // the currently-selected employee
  selectedId = null;

  employeeRoles: EmployeeRole[] = [];
  employeeRoleMap: {[id: number]: EmployeeRole} = {};

  employees: Employee[] = [];
  employeeMap: {[id: number]: Employee} = {};

  employeesOlderThan = new Date();
  searchedId: number = null;
  searchTerm = '';
  searchedEmployees = [];

  creatingEmployee = false;
  employeeDetailsFormGroup = new FormGroup({
    employeeNumber: new FormControl(),
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    birthdate: new FormControl(new Date(), [Validators.required]),
    salary: new FormControl(250000, [Validators.required, Validators.min(0)]),
    reportsTo: new FormControl(),
    role: new FormControl('', Validators.required),
  });

  employeeCanReportTo: Employee[] = [];
  saveEmployeeError = null;

  constructor(
    private readonly employeeService: EmployeeService,
    private readonly dialog: MatDialog,
  ) {
    this.employeeService.employees$.subscribe(employees => this.employees = employees);
    this.employeeService.employeeMap$.subscribe(employeeMap => this.employeeMap = employeeMap);
    this.employeeService.employeeHierarchy$.subscribe(employeeHierarchy => this.hierarchy = employeeHierarchy);
    this.employeeService.employeeRoles$.subscribe(roles => this.employeeRoles = roles);
    this.employeeService.employeeRolesMap$.subscribe(rolesMap => this.employeeRoleMap = rolesMap);
  }

  /**
   * Selects an employee to show details in the employee details
   * editor in the sidebar.
   */
  selectEmployee(employeeId) {
    this.creatingEmployee = false;
    this.selectedId = employeeId;
    this.saveEmployeeError = null;

    const employee = this.employees.find(emp => emp.id === employeeId);

    const group = this.employeeDetailsFormGroup;
    group.get('employeeNumber').setValue(employee.id);
    group.get('employeeNumber').disable();

    group.get('name').setValue(employee.name);
    group.get('surname').setValue(employee.surname);
    group.get('birthdate').setValue(new Date(employee.birthdate));
    group.get('salary').setValue(employee.salary);
    group.get('reportsTo').setValue(employee.reportsTo);
    group.get('role').setValue(employee.role);

    this.employeeCanReportTo = this.employeeService.employeeCanReportTo(employee);
  }

  /**
   * Searches the employees by ID and by name/surname.
   * If numeric, searches by ID, otherwise by name and surname.
   */
  searchEmployees() {
    // if searching a number, then searching for employee number
    if (/\d+/.test(this.searchTerm)) {
      this.selectEmployee(parseInt(this.searchTerm, 10));
      this.searchedEmployees = [];
      return;
    } else {
      this.selectedId = null;
    }

    // if the user didn't search anything, return no employees rather than all
    if (!this.searchTerm.trim().length) {
      this.searchedEmployees = [];
      return;
    }

    const searchTerm = this.searchTerm.toLowerCase();

    // find all employees whose name contains the search term
    this.searchedEmployees = this.employees.filter(employee => {
      const fullName = `${employee.name} ${employee.surname}`.toLowerCase();
      return fullName.includes(searchTerm);
    });
  }

  /**
   * Fired when the date filter changes
   */
  changeOlderThanDate($event) {
    this.changeOlderThanDate = $event.value;
  }

  /**
   * Set the employee editor state to creating a new employee.
   * Resets the form details.
   */
  addEmployee() {
    this.employeeDetailsFormGroup.reset();
    this.employeeDetailsFormGroup.get('employeeNumber').disable();
    this.employeeDetailsFormGroup.get('birthdate').setValue(new Date());
    this.creatingEmployee = true; // set the state
    this.employeeCanReportTo = this.employees; // a new employee can report to anyone
  }

  /**
   * Save an employee's details
   */
  async saveEmployee() {
    const group = this.employeeDetailsFormGroup;
    if (!group.valid) {
      return;
    }

    try {
      // save the employee
      const employee = await this.employeeService.saveEmployee({
        id: group.get('employeeNumber').value,
        name: group.get('name').value,
        surname: group.get('surname').value,
        birthdate: new Date(group.get('birthdate').value),
        salary: group.get('salary').value,
        reportsTo: group.get('reportsTo').value,
        role: group.get('role').value,
        oversees: [],
      });

      // the employee id is now the id that the server generated for the employee
      this.selectEmployee(employee.id);

      this.creatingEmployee = false;
      this.saveEmployeeError = null;
    } catch (error) {
      console.error(error);
      if (error.error.statusCode && error.error.statusCode === 400 && error.error.message) {
        this.saveEmployeeError = error.error.message;
      } else {
        this.saveEmployeeError = 'An unknown error occurred';
      }
    }
  }

  /**
   * Remove an employee. Displays a dialog to confirm deletion.
   */
  deleteEmployee() {
    // get the id of the dialog from the employee details editor
    const employeeNumber = this.employeeDetailsFormGroup.get('employeeNumber').value;
    const employee = this.employeeMap[employeeNumber];

    // create the dialog box
    const dialogRef = this.dialog.open(ConfirmEmployeeDeleteDialogComponent, {
      data: {
        employee,
      } as ConfirmDeleteEmployeeData,
    });
    dialogRef.afterClosed().subscribe(async consented => {
      console.log('closed', consented);
      if (!consented) {
        // user cancelled
        return;
      }

      // user consented - delete
      await this.employeeService.removeEmployee(employeeNumber);
    });
  }

  /**
   * Add a new role with default name 'New Role'
   */
  async addRole() {
    await this.employeeService.addRole('New Role');
  }

  /**
   * Updates an employee role
   */
  async updateRole(id, name) {
    await this.employeeService.updateRole(id, name);
  }

  /**
   * Removes a role. A dialog box is presented to ask the user
   * which role to replace it with.
   */
  removeRole(id) {
    const otherRoles = this.employeeRoles.filter(role => role.id !== id);

    const dialog = this.dialog.open(ConfirmDeleteRoleDialogComponent, {
      data: {
        roles: otherRoles,
      }
    });
    dialog.afterClosed().subscribe(async replaceWith => {
      console.log('close', replaceWith);
      if (replaceWith === false) {
        // user cancelled
        return;
      }

      await this.employeeService.removeRole(id, replaceWith);
    });
  }

  /**
   * Present a dialog box with stats about employee role salaries
   */
  async showRoleStats() {
    const stats = await this.employeeService.getRoleStats();
    console.log(stats);

    this.dialog.open(EmployeeRolestatsDialogComponent, {
      data: {
        stats,
      },
    });
  }
}
