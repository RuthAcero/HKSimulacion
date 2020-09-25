import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Constants } from 'src/app/Constants';
import { DataService } from 'src/app/services/Data/data.service';
import { EventsService } from 'src/app/services/Events/events.service';
import { ShareService } from 'src/app/services/Share/share.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-device-info',
  templateUrl: './device-info.component.html',
  styleUrls: ['./device-info.component.scss']
})
export class DeviceInfoComponent implements OnInit, OnDestroy {
  lstDevicesList = [];
  textLoader = '';
  heightContainer;
  intervalPet;

  constructor(
    private eventsService: EventsService,
    private dataService: DataService,
    private shareService: ShareService,
    private ngxLoader: NgxUiLoaderService
  ) {

  }

  ngOnInit() {
    this.getHeightContent(window.innerHeight);
    this.eventsService.varDeviceSelectInfoList = this.eventsService.
      invokeDeviceSelect.subscribe((item) => {
        console.log(item);
        if (!item.latitude) {
          this.shareService.showInfoToastAutoClose(`No se encontró posición para dispositivo "${item.name}"`)
          return;
        }
        if (item.latitude !== 0 && item.longitude !== 0) {

        } else {
          this.shareService.showInfoToastAutoClose(`No se encontró posición para dispositivo "${item.name}"`)
        }
      });
  }


  ngOnDestroy() {
    this.eventsService.varDeviceSelectInfoList.unsubscribe();
    clearInterval(this.intervalPet);
  }

  async getListFilter(data) {

    this.textLoader = 'Cargando...';
    this.ngxLoader.startLoader('loader-list-devices-update')
    clearInterval(this.intervalPet);
    await this.getLastPosition(data);
    this.ngxLoader.stopLoader('loader-list-devices-update')

    this.intervalPet = setInterval(() => {
      this.getLastPosition(data);
    }, 30000);

  }

  async getLastPosition(dataDevices) {
    try {
      const devicesGo = dataDevices.filter(ex => ex.type === 'GO');
      const devicesST = dataDevices.filter(ex => ex.type === 'ST');

      const user = this.shareService.getUser();
      let offsetValue = 0;

      if (user.timeZone) {
        offsetValue = user.summerTime ? user.timeZone.offset + 1 : user.timeZone.offset;
      }

      const auxData = [];
      if (devicesGo.length) {
        const result: any = await this.dataService.lastLocation(devicesGo.map(e => e.goId), offsetValue);
        for (const item of dataDevices) {
          if (item.type === 'GO') {
            const findGo = _.find(result, e => e.deviceId === item.goId);
            if (findGo !== null && findGo !== undefined) {
              item.status = findGo.speed > 0 ? 'Conduciendo' : 'Detenido';
              item.dateTime = moment(item.dateTime).format('YYYY-MM-DD HH:mm:ss');
              item.iconUrl = {
                path: findGo.speed > 0 ? Constants.markerSGV : Constants.markerSGVStop,
                scaledSize: { width: 80, height: 80 },
                fillColor: findGo.speed > 0 ? 'green' : 'red',
                fillOpacity: 1,
                strokeWeight: 2,
                size: 40,
                rotation: findGo.bearing,
                anchor: { x: 19, y: 19 },
                labelOrigin: { x: -10, y: 17 }
              };
              auxData.push({ ...item, ...findGo });
            } else {
              auxData.push({ ...item, latitude: 0, longitude: 0, address: '' });
            }
          }
        }
      }

      if (devicesST.length) {
        for (const item of dataDevices) {
          if (item.type === 'ST') {
            auxData.push({ ...item, latitude: 0, longitude: 0, address: '' });
          }
        }
      }

      this.lstDevicesList = auxData;
    } catch (error) {
      console.log(error);
      this.shareService.showErrorToast(error);
    }
  }


  onResize(event) {
    this.getHeightContent(event.target.innerHeight);

  }

  getHeightContent(height) {
    const tam = height < 700 ? 38 : 28;
    const percent = (height * tam) / 100;
    this.heightContainer = height - percent;
  }

}
