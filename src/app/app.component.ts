import { Component, NgZone } from '@angular/core';
import { ApiService } from './api/api.service';
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

  constructor(
    private readonly api: ApiService,
    private ngZone: NgZone,
  ) {
    this.api.$authStateChange.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        console.log('logged in');
      }
    });
  }

}
