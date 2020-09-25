import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonitoringComponent } from './components/monitoring/monitoring.component';
import { MapComponent } from './components/map/map.component';
import { TableDevicesComponent } from './components/table-devices/table-devices.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaIconsModule } from '../fa-icons/fa-icons.module';
import { ToolsModule } from '../tools/tools.module';
import { NgBootstrpMModule } from '../ng-bootstrp-m/ng-bootstrp-m.module';
import { MainMonitoringComponent } from './components/main-monitoring/main-monitoring.component';
import { MainFilterComponent } from './components/main-filter/main-filter.component';
import { DeviceInfoComponent } from './components/device-info/device-info.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FaIconsModule,
    NgBootstrpMModule,
    ToolsModule,
  ],
  declarations: [MonitoringComponent, MapComponent, TableDevicesComponent, MainMonitoringComponent, MainFilterComponent, DeviceInfoComponent],
  exports: [MonitoringComponent, MainMonitoringComponent]
})
export class MonitoringModule { }
