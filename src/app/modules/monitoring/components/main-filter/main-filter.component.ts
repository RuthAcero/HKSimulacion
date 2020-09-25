import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MyGeotabService } from 'src/app/services/MyGeotab/my-geotab.service';
import { ShareService } from 'src/app/services/Share/share.service';
import * as _ from 'lodash';
import { EventsService } from 'src/app/services/Events/events.service';

@Component({
  selector: 'app-main-filter',
  templateUrl: './main-filter.component.html',
  styleUrls: ['./main-filter.component.scss']
})
export class MainFilterComponent implements OnInit {
  @Output() outPutList = new EventEmitter();
  @Output() menuOption = new EventEmitter();

  lstAllDevices = [];
  lstDevicesSelect = [];
  lstDevicesList = [];
  itemsMenu;
  imgIcon = 'assets/bus_monitoring.png';

  textLoader = '';
  itemsBuffer = [];
  bufferSize = 50;
  numberOfItemsFromEndBeforeFetchingMore = 10;
  loading = false;

  constructor(
    private shareService: ShareService,
    private goeotabService: MyGeotabService,
    private eventService: EventsService,
    private ngxLoader: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.initData();

    this.itemsMenu = [
      {
        label: 'Mostrar', icon: 'pi pi-fw pi-eye', command: () => {
          this.selectedMenuItem(0, 1);
        }
      },
      /*{
        label: 'Crear', icon: 'pi pi-fw pi-download', command: () => {
          this.selectedMenuItem(0, 2);
        }
      },*/
    ];
  }

  selectedMenuItem(num, type) {
    this.eventService.activeOptionSelected({ num: num, type: type });
  }

  async initData() {

    const vehicle = this.shareService.getVehicles(), devices = this.shareService.getDevicesST(),
      goDevices: any = await this.goeotabService.getDevices(), auxItems = [], devicesInList = [];
    devices.map(e => e.id = e.suntechId);

    for (const item of vehicle) {
      const findGo = _.findIndex(goDevices, e => e.id === item.goId);
      if (findGo >= 0) {
        item.name = goDevices[findGo].name;
        item.serialNumber = goDevices[findGo].serialNumber;
        item.vin = goDevices[findGo].vin ? goDevices[findGo].vin : '';
        item.plate = goDevices[findGo].plate ? goDevices[findGo].plat : '';

        const findDevice = _.findIndex(devices, e => e.id === item.deviceId);
        item.device = findDevice >= 0 ? devices[findDevice] : null;
        item.deviceName = findDevice >= 0 ? devices[findDevice].name : '';

        if (findDevice >= 0) {
          devicesInList.push(devices[findDevice].suntechId);
        }
        item.type = 'GO';
        auxItems.push(item);
      }
    }

    const devicesGo = auxItems, devicesSt = this.suntechsDis(devices, devicesInList);
    devicesSt.map(e => e.vin = e.imei);
    devicesSt.map(e => e.type = 'ST');
    const devA = devicesGo.concat(devicesSt);

    this.lstAllDevices = devA
    this.lstDevicesList = devA
    this.outPutList.emit(devA);
  }

  suntechsDis(devices, devicesAux) {
    const auxDevs = [];
    for (const item of devices) {
      if (_.findIndex(devicesAux, e => e === item.suntechId) < 0) {
        auxDevs.push(item);
      }
    }
    return auxDevs;
  }

  selectedAllDev(status) {
    this.lstDevicesList = status ? this.lstAllDevices : [];
    this.outPutList.emit(status ? this.lstAllDevices : []);
  }

  changeItems() {
    this.outPutList.emit(this.lstDevicesList);
  }

  onScrollToEnd() {
    this.fetchMore();
  }

  onScroll({ end }) {

    if (this.loading || this.lstAllDevices.length <= this.itemsBuffer.length) {
      return;
    }

    if (end + this.numberOfItemsFromEndBeforeFetchingMore >= this.itemsBuffer.length) {
      this.fetchMore();
    }

  }

  fetchMore() {
    const len = this.itemsBuffer.length;
    const more = this.lstAllDevices.slice(len, this.bufferSize + len);
    this.loading = true;
    // using timeout here to simulate backend API delay
    setTimeout(() => {
      this.loading = false;
      this.itemsBuffer = this.itemsBuffer.concat(more);
    }, 200)
  }

  fetchMoreA() {
    const len = this.itemsBuffer.length;
    const more = this.lstAllDevices.slice(len, this.bufferSize + len);
    this.itemsBuffer = this.itemsBuffer.concat(more);
    // using timeout here to simulate backend API delay
    setTimeout(() => {
      this.loading = false;
    }, 200)
  }
}
