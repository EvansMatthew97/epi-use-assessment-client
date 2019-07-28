import { NgModule } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './auth.guard';
import { ModuleWithProviders } from '@angular/compiler/src/core';

@NgModule({
  imports: [
    HttpClientModule,
  ],
})
export class ApiModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ApiModule,
      providers: [
        ApiService,
        AuthGuard,
      ],
    };
  }
}
