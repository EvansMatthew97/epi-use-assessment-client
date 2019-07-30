import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Employee } from './interfaces/employee.interface';
import { EmployeeRole } from './interfaces/employee-role.interface';
import { BehaviorSubject } from 'rxjs';

/**
 * Service for handling employee and employee role data.
 */
@Injectable()
export class EmployeeService {
  private employees: Employee[] = [];
  public employees$ = new BehaviorSubject(this.employees);

  private employeeMap: {[id: number]: Employee} = {};
  public employeeMap$ = new BehaviorSubject(this.employeeMap);

  private employeeHierarchy: Employee[] = [];
  public employeeHierarchy$ = new BehaviorSubject(this.employeeHierarchy);

  private employeeRoles: EmployeeRole[] = [];
  public employeeRoles$ = new BehaviorSubject(this.employeeRoles);

  private employeeRolesMap: {[id: number]: EmployeeRole} = {};
  public employeeRolesMap$ = new BehaviorSubject(this.employeeRolesMap);

  constructor(
    private api: ApiService,
  ) {
    // fetch data as soon as authenticated
    this.api.$authStateChange.subscribe(isLoggedIn => {
      this.fetchData();
    });
  }

  /**
   * Fetches data from the API and stores it
   */
  async fetchData() {
    await Promise.all([
      this.fetchEmployees(),
      this.fetchEmployeeRoles(),
    ]);
  }

  /**
   * Fetches employees and employee hierarchy from the API
   */
  async fetchEmployees() {
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

    this.employeeHierarchy = hierarchy;

    this.employees$.next(this.employees);
    this.employeeMap$.next(this.employeeMap);
    this.employeeHierarchy$.next(this.employeeHierarchy);
  }

  /**
   * Fetches employee role information from the API
   */
  async fetchEmployeeRoles() {
    this.employeeRoles = (await this.api.get('/employee-role', {})).reverse();
    this.employeeRolesMap = this.employeeRoles.reduce((ob, role) => {
      ob[role.id] = role;
      return ob;
    }, {});

    this.employeeRoles$.next(this.employeeRoles);
    this.employeeRolesMap$.next(this.employeeRolesMap);
  }

  /**
   * Saves an employee and returns the API's representation
   * (useful for getting the ID of the added employee)
   */
  async saveEmployee(employee: Employee): Promise<Employee> {
    const res = await this.api.post('/employee/save', {
      employeeNumber: employee.id,
      name: employee.name,
      surname: employee.surname,
      birthdate: new Date(employee.birthdate).toISOString(),
      salary: employee.salary,
      reportsToEmployeeId: employee.reportsTo,
      employeeRoleId: employee.role,
    });

    await this.fetchEmployees(); // update employees
    return res;
  }

  /**
   * Remove an employee from the database
   * @param employeeNumber ID of the employee
   */
  async removeEmployee(employeeNumber: number) {
    await this.api.post('/employee/remove', {
      employeeNumber,
    });
    await this.fetchEmployees();
  }

  /**
   * Adds an employee role with the given name
   */
  async addRole(name: string) {
    await this.api.post('/employee-role/save', {
      name,
    });
    await this.fetchEmployeeRoles();
  }

  /**
   * Updates a role with the given id
   */
  async updateRole(id, name) {
    await this.api.post('/employee-role/save', {
      id,
      name,
    });

    await this.fetchEmployeeRoles();
  }

  /**
   * Removes a role by replacing it with another role
   * @param roleToRemoveId Role id to remove
   * @param roleToReplaceId Role id to replace with
   */
  async removeRole(roleToRemoveId: number, roleToReplaceId: number) {
    await this.api.post('/employee-role/remove', {
      roleToRemoveId,
      roleToReplaceId,
    });

    await this.fetchData(); // have to fetch employee data, too as their role can change
  }

  /**
   * Returns salary statistics for the employee roles
   */
  async getRoleStats(): Promise<Array<{
    role: EmployeeRole,
    employee: Employee,
  }>> {
    const roleStats = await this.api.get('/employee-role/highest-earning-by-role', {});

    if (!this.employeeRoles.length) {
      await this.fetchEmployeeRoles();
    }

    return Object.keys(roleStats).map(roleId => ({
      role: this.employeeRolesMap[roleId],
      employee: this.employeeMap[roleStats[roleId].id],
    }));
  }

  /**
   * Find all employees who the selected emplyoee can report to
   * (no child tree nodes or themself)
   */
  employeeCanReportTo(employee: Employee): Employee[] {
    if (!employee.id) {
      return this.employees;
    }

    const recursiveDescendantSearch = (emp: Employee, descendants = []) => {
      descendants.push(emp);

      (emp.oversees || []).forEach(childId => {
        const child = this.employeeMap[childId];
        descendants.push(...recursiveDescendantSearch(child));
      });

      return descendants;
    };

    const descendantIds: {[id: number]: boolean} = recursiveDescendantSearch(employee).reduce((ob, emp) => {
      ob[emp.id] = true;
      return ob;
    }, {});

    console.log(descendantIds);

    return this.employees.filter(emp => !descendantIds[emp.id]);
  }
}
