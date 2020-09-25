import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModalModule, NgbAlertModule, NgbDropdownModule, NgbTooltipModule, NgbProgressbarModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    NgbModalModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbAlertModule,
    NgbProgressbarModule,
    NgbPaginationModule
  ],
  exports: [
    NgbModalModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbAlertModule,
    NgbProgressbarModule,
    NgbPaginationModule
  ],
  declarations: []
})
export class NgBootstrpMModule { }
