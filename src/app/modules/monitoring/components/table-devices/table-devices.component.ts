import { Component, Input, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ShareService } from 'src/app/services/Share/share.service';

@Component({
  selector: 'app-table-devices',
  templateUrl: './table-devices.component.html',
  styleUrls: ['./table-devices.component.scss']
})
export class TableDevicesComponent implements OnInit {
  @Input() devices = [];
  constructor(
    private shareService: ShareService,
    private ngxLoader: NgxUiLoaderService
  ) { }

  ngOnInit() {
  }

  initData() {

  }
}
