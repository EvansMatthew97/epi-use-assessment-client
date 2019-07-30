import { Component } from '@angular/core';
import { ApiService } from './api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    public readonly api: ApiService,
    private readonly router: Router,
  ) {
    this.api.$authStateChange.subscribe(isLoggedIn => {
      console.log('is logged in', isLoggedIn);
      if (!isLoggedIn) {
        console.log('navigating to login');
        this.router.navigate(['login']);
      } else {
        console.log('navigating to editor');
        this.router.navigate(['editor']);
      }
    });
  }

}
