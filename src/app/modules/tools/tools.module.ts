import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxUiLoaderModule, NgxUiLoaderConfig } from 'ngx-ui-loader';
import { ToastrModule, ToastContainerModule } from 'ngx-toastr';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module
import { FilterPipeModule } from 'ngx-filter-pipe';
import {ScrollingModule} from '@angular/cdk/scrolling';


/* PRIME NG*/
import { DialogModule } from 'primeng/dialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { MenuModule } from 'primeng/menu';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: '#red',
  fgsColor: '#006492',
  pbColor: '#426eb1',
  blur: 60,
  textColor: '#006492',
  hasProgressBar: false,
  fgsSize: 70,
  fgsType: 'three-strings',
  overlayColor: 'rgb(255,255,255)'
};


@NgModule({
  imports: [
    CommonModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgSelectModule,
    FlexLayoutModule,
    DialogModule,
    OverlayPanelModule,
    TooltipModule,
    CalendarModule,
    CheckboxModule,
    MenuModule,
    NgxPaginationModule,
    FilterPipeModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    ToastContainerModule,
    ScrollingModule,
  ],
  declarations: [],
  exports: [
    NgxUiLoaderModule,
    NgSelectModule,
    FlexLayoutModule,
    ToastrModule,
    ToastContainerModule,
    DialogModule,
    OverlayPanelModule,
    TooltipModule,
    MenuModule,
    CalendarModule,
    CheckboxModule,
    NgxPaginationModule,
    FilterPipeModule,
    ScrollingModule
  ]
})
export class ToolsModule { }
