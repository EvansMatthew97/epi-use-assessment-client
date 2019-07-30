import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Service for monitoring network status
 */
@Injectable()
export class NetworkStatusService {
  public readonly onlineStatus$ = new BehaviorSubject(true);

  constructor() {
    window.addEventListener('online', () => {
      this.onlineStatus$.next(true);
    });

    window.addEventListener('offline', () => {
      this.onlineStatus$.next(false);
    });
  }
}
