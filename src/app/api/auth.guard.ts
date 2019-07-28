import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly api: ApiService,
  ) {}

  canActivate(): boolean {
    return this.api.isAuthenticated();
  }
}
