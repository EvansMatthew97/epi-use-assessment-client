import { Component, OnInit } from '@angular/core';
import { PanZoomConfig } from 'ng2-panzoom';
import { Employee } from '../interfaces/employee.interface';
import { ApiService } from '../api/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeRole } from '../interfaces/employee-role.interface';
import { MatDialog } from '@angular/material';
import { ConfirmEmployeeDeleteDialogComponent, ConfirmDeleteEmployeeData } from './dialogs/confirm-employee-delete.component';
import { EmployeeRolestatsDialogComponent } from './dialogs/employee-role-stats-dialog.component';
import { ConfirmDeleteRoleDialogComponent } from './dialogs/confirm-delete-role-dialog.component';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  zoomConfig: PanZoomConfig = new PanZoomConfig({
    freeMouseWheelFactor: 0.01,
  });

  hierarchy: Employee[] = [];
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
    private readonly api: ApiService,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.fetchData();
  }

  async fetchData() {
    // fetch employee roles
    this.employeeRoles = (await this.api.get('/employee-role', {})).reverse();
    this.employeeRoleMap = this.employeeRoles.reduce((ob, role) => {
      ob[role.id] = role;
      return ob;
    }, {});

    // fetch employees
    this.employees = await this.api.get('/employee', {});
    this.employeeMap = this.employees.reduce((ob, employee: Employee) => {
      ob[employee.id] = employee;
      return ob;
    }, {});

    // get employee hierarchy
    const hierarchy = await this.api.get('/employee/hierarchy', {});

    const recursiveMapHierarchy = (employee) => {
      employee.reportsTo = this.employeeMap[employee.id].reportsTo;
      employee.role = this.employeeMap[employee.id].role;
      employee.oversees.forEach(child => recursiveMapHierarchy(child));
    };
    hierarchy.forEach(recursiveMapHierarchy);

    this.hierarchy = hierarchy;

    console.log(this.hierarchy);
    console.log(this.employees);
  }


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

    // find all employees who the selected emplyoee can report to
    // (no child tree nodes or themself)
    const recursiveDescendantSearch = (emp: Employee, descendantIds = []) => {
      descendantIds.push(emp.id);

      (emp.oversees || []).forEach(childId => {
        const child = this.employeeMap[childId];
        descendantIds.push(...recursiveDescendantSearch(child));
      });

      return descendantIds;
    };

    const descendantIds: {[id: number]: boolean} = recursiveDescendantSearch(employee).reduce((ob, empId) => {
      ob[empId] = true;
      return ob;
    }, {});

    console.log(descendantIds);

    this.employeeCanReportTo = this.employees.filter(emp => !descendantIds[emp.id]);
  }

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

  changeOlderThanDate($event) {
    this.changeOlderThanDate = $event.value;
  }

  addEmployee() {
    this.employeeDetailsFormGroup.reset();
    this.employeeDetailsFormGroup.get('employeeNumber').disable();
    this.employeeDetailsFormGroup.get('birthdate').setValue(new Date());
    this.creatingEmployee = true;
  }

  async saveEmployee() {
    const group = this.employeeDetailsFormGroup;
    if (!group.valid) {
      return;
    }

    try {
      const employee = await this.api.post('/employee/save', {
        employeeNumber: group.get('employeeNumber').value,
        name: group.get('name').value,
        surname: group.get('surname').value,
        birthdate: new Date(group.get('birthdate').value).toISOString(),
        salary: group.get('salary').value,
        reportsToEmployeeId: group.get('reportsTo').value,
        employeeRoleId: group.get('role').value,
      });
      await this.fetchData();

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

  deleteEmployee() {
    const employeeNumber = this.employeeDetailsFormGroup.get('employeeNumber').value;
    const employee = this.employeeMap[employeeNumber];

    const dialogRef = this.dialog.open(ConfirmEmployeeDeleteDialogComponent, {
      data: {
        employee,
      } as ConfirmDeleteEmployeeData,
    });
    dialogRef.afterClosed().subscribe(async consented => {
      console.log('closed', consented);
      if (!consented) {
        return;
      }

      await this.api.post('/employee/remove', {
        employeeNumber,
      });
      await this.fetchData();
    });
  }

  async addRole() {
    await this.api.post('/employee-role/save', {
      name: 'New role',
    });
    await this.fetchData();
  }

  async updateRole(id, name) {
    await this.api.post('/employee-role/save', {
      id,
      name,
    });
    await this.fetchData();
  }

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

      console.log(id, replaceWith);
      await this.api.post('/employee-role/remove', {
        roleToRemoveId: id,
        roleToReplaceId: replaceWith,
      });

      await this.fetchData();
    });
  }

  async showRoleStats() {
    const roleStats = await this.api.get('/employee-role/highest-earning-by-role', {});

    const stats = Object.keys(roleStats).map(roleId => ({
      role: this.employeeRoleMap[roleId],
      employee: this.employeeMap[roleStats[roleId].id],
    }));

    console.log(stats);

    this.dialog.open(EmployeeRolestatsDialogComponent, {
      data: {
        stats,
      },
    });
  }
}
