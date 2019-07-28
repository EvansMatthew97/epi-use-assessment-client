import { Component, OnInit } from '@angular/core';
import { PanZoomConfig } from 'ng2-panzoom';
import { Employee } from '../interfaces/employee.interface';
import { ApiService } from '../api/api.service';

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

  constructor(
    private readonly api: ApiService,
  ) {}

  async ngOnInit() {
    this.hierarchy = await this.api.get('/employee/hierarchy', {});
    this.selectedId = this.hierarchy[0].id || null;
    console.log(this.hierarchy);
  }


  selectEmployee(employee) {
    this.selectedId = employee.id;
  }
}
