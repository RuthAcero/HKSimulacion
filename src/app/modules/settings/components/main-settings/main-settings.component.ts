import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-settings',
  templateUrl: './main-settings.component.html',
  styleUrls: ['./main-settings.component.scss']
})
export class MainSettingsComponent implements OnInit {
  itemMenuSelected = null;
  constructor() { }

  ngOnInit() {
    this.itemMenuSelected = 0;
  }

  selectInMenu(num) {
    if (this.itemMenuSelected !== num) {
      this.itemMenuSelected = num;
    }
  }

}
