import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Employee } from 'src/app/interfaces/employee.interface';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  @Input() employee: Employee;
  @Input() selectedId: number;
  @Output() selectEmployee = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  clickEmployee(employee) {
    this.selectEmployee.emit(employee);
  }

}
