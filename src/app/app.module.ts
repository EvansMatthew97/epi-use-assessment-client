import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { ApiModule } from './api/api.module';
import { EmployeeModule } from './employee/employee.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,

    ApiModule.forRoot(),
    EmployeeModule.forRoot(),
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'en-ZA' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
