import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Employee } from 'src/app/employee/interfaces/employee.interface';
import { EmployeeRole } from '../../../employee/interfaces/employee-role.interface';

/**
 * Component for representing employee hierarchies.
 */
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  @Input() employee: Employee;
  @Input() selectedId: number; // employee should be highlighted
  @Input() olderThan: Date; // for filtering by age

  @Input() searchedEmployees: Employee[] = []; // for filtering by search
  @Input() searchedId: number = null;
  @Input() employeeRolesMap: {[id: number]: EmployeeRole};

  @Output() selectEmployee = new EventEmitter(); // emitted on selecting employee

  constructor() { }

  ngOnInit() {
  }

  /**
   * Determines whether the user is older than the date given
   */
  isOlderThanDate(): boolean {
    if (!this.olderThan) {
      return true;
    }
    return new Date(this.employee.birthdate) < this.olderThan;
  }

  /**
   * Determine whether the user meets search criteria
   */
  isSearchedFor(): boolean {
    return this.searchedEmployees
      .some(employee => employee.id === this.employee.id);
  }

  /**
   * Select employee
   */
  clickEmployee(employee) {
    this.selectEmployee.emit(employee);
  }

}
