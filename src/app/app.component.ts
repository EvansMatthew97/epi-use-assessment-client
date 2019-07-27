import { Component, NgZone } from '@angular/core';
import { ApiService } from './services/api.service';
import { Employee } from './interfaces/employee.interface';

import { PanZoomConfig } from 'ng2-panzoom';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'client';
  error = 'loading';

  zoomConfig: PanZoomConfig = new PanZoomConfig({
    zoomLevels: 10,
    freeMouseWheelFactor: 0.01,
    dragMouseButton: 'left',
    keepInBounds: true,
  });

  hierarchy: Employee[] = [
    {
        "id": 1,
        "name": "John",
        "surname": "Smith",
        "birthdate": new Date("1960-03-04T00:00:00.000Z"),
        "salary": 700000,
        "oversees": [
            {
                "id": 2,
                "name": "Jane",
                "surname": "Doe",
                "birthdate": new Date("1980-05-06T00:00:00.000Z"),
                "salary": 500000,
                "oversees": [
                    {
                        "id": 3,
                        "name": "Jim",
                        "surname": "Bean",
                        "birthdate": new Date("1978-01-03T00:00:00.000Z"),
                        "salary": 650000,
                        "oversees": []
                    },
                    {
                        "id": 4,
                        "name": "Roger",
                        "surname": "Wilco",
                        "birthdate": new Date("1995-12-11T00:00:00.000Z"),
                        "salary": 200000,
                        "oversees": []
                    },
                    {
                        "id": 5,
                        "name": "Susan",
                        "surname": "Roe",
                        "birthdate": new Date("1994-10-10T00:00:00.000Z"),
                        "salary": 250000,
                        "oversees": []
                    }
                ]
            },
            {
              "id": 6,
              "name": "Matthew",
              "surname": "Evans",
              "birthdate": new Date("1997-10-21T00:00:00.000Z"),
              "salary": 250000,
              "oversees": []
          }
        ]
    }
  ];
  selectedId = this.hierarchy[0].id;

  constructor(
    private readonly api: ApiService,
    private ngZone: NgZone,
  ) {
    this.api.$authStateChange.subscribe(state => {
      this.error = state.toString();
    });
    console.log(this.hierarchy);
  }

  selectEmployee(employee) {
    this.selectedId = employee.id;
    this.ngZone.run(() => {});
  }

}
