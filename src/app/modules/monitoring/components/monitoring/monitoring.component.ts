import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { MyGeotabService } from 'src/app/services/MyGeotab/my-geotab.service';
import { ShareService } from 'src/app/services/Share/share.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DataService } from 'src/app/services/Data/data.service';
import { Constants } from 'src/app/Constants';
import * as _ from 'lodash';
import * as moment from 'moment';
import { EventsService } from 'src/app/services/Events/events.service';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.scss']
})
export class MonitoringComponent implements OnInit, OnDestroy {
  @Output() out = new EventEmitter();
  @Input() typeMap;
  activeSlidebar = false;
  textLoader = '';
  lstAllDevices = [];
  lstDevicesSelect = [];
  lstDevicesList = [];
  heightContainer = 0;
  itemsMenu = [
    { label: 'Crear', icon: 'pi pi-fw pi-plus' },
    { label: 'Mostrar', icon: 'pi pi-fw pi-download' },
  ];
  imgIcon = 'assets/bus_monitoring.png';
  intervalPet;
  seeTableDevices = true;
  isFirst = true;

  constructor(
    private shareService: ShareService,
    private goeotabService: MyGeotabService,
    private dataService: DataService,
    private eventService: EventsService,
    private ngxLoader: NgxUiLoaderService,
  ) { }


  ngOnInit() {
    this.seeTableDevices = window.innerWidth > 600;
    this.getHeightContent(window.innerHeight);
    this.textLoader = 'Cargando...';
    this.ngxLoader.startLoader('loader-monitoring');
  }

  ngOnDestroy() {
    clearInterval(this.intervalPet);
  }

  async getListFilter(data) {
    if (this.isFirst) {
      this.textLoader = 'Cargando...';
      this.ngxLoader.startLoader('loader-monitoring');
    }

    clearInterval(this.intervalPet);
    await this.getLastPosition(data);


    if (this.isFirst) {
      this.ngxLoader.stopLoader('loader-monitoring');
      this.isFirst = false;
    }

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
      this.eventService.activeDevicesList(auxData);
    } catch (error) {
      console.log(error);
      this.shareService.showErrorToast(error);
    }
  }

  onResize(event) {
    this.getHeightContent(event.target.innerHeight);
    this.seeTableDevices = event.target.innerWidth > 600;

  }


  getHeightContent(height) {
    const tam = height < 700 ? 12.8 : 12;
    const percent = (height * tam) / 100;
    this.heightContainer = height - percent;
  }


  selectedList() {
    this.out.emit({})
  }


}



