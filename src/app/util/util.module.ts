import { NgModule } from '@angular/core';
import { CustomDatePipe } from './pipes/custom-date.pipe';
import { NetworkStatusService } from './services/network-status.service';

@NgModule({
  declarations: [
    CustomDatePipe,
  ],
  providers: [
    NetworkStatusService,
  ],
  exports: [
    CustomDatePipe,
  ]
})
export class UtilModule {}
