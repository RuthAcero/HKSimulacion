import { Component, Input, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { EventsService } from 'src/app/services/Events/events.service';
import { ShareService } from 'src/app/services/Share/share.service';

@Component({
  selector: 'app-table-devices',
  templateUrl: './table-devices.component.html',
  styleUrls: ['./table-devices.component.scss']
})
export class TableDevicesComponent implements OnInit {
  @Input() devices = [];
  @Input() heightContent;
  constructor(
    private shareService: ShareService,
    private eventsService: EventsService,
    private ngxLoader: NgxUiLoaderService
  ) { }

  ngOnInit() {
  }

  initData() {

  }

  selectedDevice(item) {
    this.eventsService.activeSelectDevice(item);
  }
}
