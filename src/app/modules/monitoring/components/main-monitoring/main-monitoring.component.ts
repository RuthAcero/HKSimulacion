import { Component, OnInit } from '@angular/core';
import { EventsService } from 'src/app/services/Events/events.service';

@Component({
  selector: 'app-main-monitoring',
  templateUrl: './main-monitoring.component.html',
  styleUrls: ['./main-monitoring.component.scss']
})
export class MainMonitoringComponent implements OnInit {
  seeMonitoring = true;
  seeList = false;
  typeMap = 0;
  constructor(
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.eventsService.varOptionSelect = this.eventsService.
      invokeOptionSelect.subscribe((item) => {
        this.selectedMenu(item);
      });
  }

  selectedMenu(item) {
    switch (item.num) {
      case 0:
        this.seeList = false;
        this.seeMonitoring = true;
        this.typeMap = item.type;
        break;
      case 1:
        this.seeList = true;
        this.seeMonitoring = false;
        break;
      default:
        this.seeMonitoring = true;
        this.seeList = false;
    }
  }
  getBack(data) {
    this.seeMonitoring = !this.seeMonitoring;
    this.seeList = this.seeList
  }
}
