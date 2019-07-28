import { Component, OnInit } from '@angular/core';
import { PanZoomConfig } from 'ng2-panzoom';
import { Employee } from '../interfaces/employee.interface';
import { ApiService } from '../api/api.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  zoomConfig: PanZoomConfig = new PanZoomConfig({
    zoomLevels: 10,
    freeMouseWheelFactor: 0.01,
    dragMouseButton: 'left',
    keepInBounds: true,
  });

  hierarchy: Employee[] = [];
  selectedId = null;

  employees: Employee[] = [];

  employeesOlderThan = new Date();
  searchedId: number = null;
  searchTerm = '';
  searchedEmployees = [];

  constructor(
    private readonly api: ApiService,
  ) {}

  async ngOnInit() {
    this.employees = await this.api.get('/employee', {});
    this.hierarchy = await this.api.get('/employee/hierarchy', {});
    this.selectedId = this.hierarchy[0].id || null;

    this.searchEmployees();
  }


  selectEmployee(employee) {
    this.selectedId = employee.id;
  }

  searchEmployees() {
    if (/\d+/.test(this.searchTerm)) {
      this.selectedId = parseInt(this.searchTerm, 10);
      this.searchedEmployees = [];
      return;
    } else {
      this.selectedId = null;
    }

    const searchTerm = this.searchTerm.toLowerCase();
    console.log(searchTerm);

    this.searchedEmployees = this.employees.filter(employee => {
      const fullName = `${employee.name} ${employee.surname}`.toLowerCase();
      return fullName.includes(searchTerm);
    });
  }

  changeOlderThanDate($event) {
    this.changeOlderThanDate = $event.value;
  }
}
