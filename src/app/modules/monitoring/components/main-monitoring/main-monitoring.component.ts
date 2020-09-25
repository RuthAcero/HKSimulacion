import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-monitoring',
  templateUrl: './main-monitoring.component.html',
  styleUrls: ['./main-monitoring.component.scss']
})
export class MainMonitoringComponent implements OnInit {
  seeMonitoring = true;
  seeList = false;
  constructor() { }

  ngOnInit() {
  }

  getBack(data) {
    this.seeMonitoring = !this.seeMonitoring;
    this.seeList = this.seeList
  }
}
