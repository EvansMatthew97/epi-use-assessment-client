import { Component } from '@angular/core';
import { ApiService } from './services/api.service';

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
  ) {
    this.api.$authStateChange.subscribe(state => {
      this.error = state.toString();
    });
  }


}
