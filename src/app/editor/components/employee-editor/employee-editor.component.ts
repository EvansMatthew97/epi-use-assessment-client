import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Employee } from 'src/app/employee/interfaces/employee.interface';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EmployeeService } from '../../../employee/employee.service';
import { EmployeeRole } from 'src/app/employee/interfaces/employee-role.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-employee-editor',
  templateUrl: './employee-editor.component.html',
  styleUrls: ['./employee-editor.component.scss'],
})
export class EmployeeEditorComponent implements OnChanges, OnInit, OnDestroy {
  @Input() employee: Employee;
  @Input() saveEmployeeError: string = null;
  @Input() creatingEmployee: boolean = false;
  @Output() save = new EventEmitter<Employee>();
  @Output() delete = new EventEmitter<number>();

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

  employeeRoles: EmployeeRole[] = [];
  employeeRolesSubscription: Subscription = null;

  constructor(
    private readonly employeeService: EmployeeService,
  ) {
    this.employeeRolesSubscription = this.employeeService.employeeRoles$.subscribe(roles => {
      this.employeeRoles = roles;
    });
  }

  ngOnInit() {
    this.employeeDetailsFormGroup.get('employeeNumber').disable();
  }

  ngOnDestroy() {
    this.employeeRolesSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.employee) {
      // deep copy the employee so as to not overwrite (memento)
      this.employee = {...this.employee};
      this.employeeCanReportTo = this.employeeService.employeeCanReportTo(this.employee);

      const group = this.employeeDetailsFormGroup;
      group.get('employeeNumber').disable();
      group.get('employeeNumber').setValue(this.employee.id);
      group.get('name').setValue(this.employee.name);
      group.get('surname').setValue(this.employee.surname);
      group.get('birthdate').setValue(this.employee.birthdate);
      group.get('salary').setValue(this.employee.salary);
      group.get('reportsTo').setValue(this.employee.reportsTo);
      group.get('role').setValue(this.employee.role);
    }
  }

  saveEmployee() {
    const group = this.employeeDetailsFormGroup;
    const employee: Employee = {
      id: group.get('employeeNumber').value,
      name: group.get('name').value,
      surname: group.get('surname').value,
      birthdate: group.get('birthdate').value,
      salary: group.get('salary').value,
      reportsTo: group.get('reportsTo').value,
      role: group.get('role').value,
      oversees: this.employee.oversees,
    };
    this.save.emit(employee);
  }

  deleteEmployee() {
    const id = this.employeeDetailsFormGroup.get('employeeNumber').value;
    this.delete.emit(id);
  }
}
