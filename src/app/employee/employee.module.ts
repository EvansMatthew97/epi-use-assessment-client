import { NgModule } from '@angular/core';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { EmployeeService } from './employee.service';
import { ApiModule } from '../api/api.module';

@NgModule({
  imports: [
    ApiModule,
  ],
})
export class EmployeeModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: EmployeeModule,
      providers: [
        EmployeeService,
      ],
    };
  }
}
