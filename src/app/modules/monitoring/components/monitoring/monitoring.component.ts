import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MyGeotabService } from 'src/app/services/MyGeotab/my-geotab.service';
import { ShareService } from 'src/app/services/Share/share.service';
import * as _ from 'lodash';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.scss']
})
export class MonitoringComponent implements OnInit {
  @Output() out = new EventEmitter();
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




  constructor(
    private shareService: ShareService,
    private goeotabService: MyGeotabService,
    private ngxLoader: NgxUiLoaderService,

  ) { }

  ngOnInit() {
    this.getHeightContent(window.innerHeight);
  }



  getListFilter(data) {
    console.log(data);
    this.lstDevicesList = data
  }



  onResize(event) {
    this.getHeightContent(event.target.innerHeight);
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



