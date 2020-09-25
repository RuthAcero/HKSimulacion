import { Component, OnInit } from '@angular/core';
import { ShareService } from 'src/app/services/Share/share.service';

@Component({
  selector: 'app-main-settings',
  templateUrl: './main-settings.component.html',
  styleUrls: ['./main-settings.component.scss']
})
export class MainSettingsComponent implements OnInit {
  itemMenuSelected = null;
  seeUnits = false;
  seeDevices = false;
  seeUsers = false;
  seeRoles = false;

  constructor(
    private shareService: ShareService
  ) { }

  ngOnInit() {
    const user = this.shareService.getUser();
    console.log(user);
    const permissions = user.role ? user.role : null;
    if (permissions === null) {
      return;
    }

    const seeU = permissions.permissions.find(e => e.moduleId === 3);
    this.seeUnits = seeU !== undefined ? seeU.read : false;

    const seeUs = permissions.permissions.find(e => e.moduleId === 4);
    this.seeUsers = seeUs !== undefined ? seeUs.read : false;

    const seeRol = permissions.permissions.find(e => e.moduleId === 5);
    this.seeRoles = seeRol !== undefined ? seeRol.read : false;

    /*
    const seeDev = permissions.permissions.find(e => e.moduleId === 6);
    this.seeRoles = seeDev !== undefined ? seeDev.read : false;
*/
    this.itemMenuSelected = 0;
  }

  selectInMenu(num) {
    if (this.itemMenuSelected !== num) {
      this.itemMenuSelected = num;
    }
  }

}
