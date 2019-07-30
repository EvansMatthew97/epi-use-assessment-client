import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Employee } from 'src/app/editor/interfaces/employee.interface';
import { EmployeeRole } from '../../interfaces/employee-role.interface';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  @Input() employee: Employee;
  @Input() selectedId: number;
  @Input() olderThan: Date;

  @Input() searchedEmployees: Employee[] = [];
  @Input() searchedId: number = null;
  @Input() employeeRolesMap: {[id: number]: EmployeeRole};

  @Output() selectEmployee = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  isOlderThanDate(): boolean {
    if (!this.olderThan) {
      return true;
    }
    return new Date(this.employee.birthdate) < this.olderThan;
  }

  isSearchedFor(): boolean {
    return this.searchedEmployees
      .some(employee => employee.id === this.employee.id);
  }

  clickEmployee(employee) {
    this.selectEmployee.emit(employee);
  }

}
