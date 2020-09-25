import { Component, OnInit, ViewChild } from '@angular/core';
import { MyGeotabService } from './services/MyGeotab/my-geotab.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LoginService } from './services/Login/login.service';
import { ShareService } from './services/Share/share.service';
import { environment } from 'src/environments/environment';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { Constants } from './Constants';
import { RolesService } from './services/Roles/roles.service';
import { UsersService } from './services/Users/users.service';
import * as _ from 'lodash';
import { DevicesService } from './services/Devices/devices.service';
import { VehiclesService } from './services/Vehicles/vehicles.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;
  title = 'app-security';
  seeApp = false;
  seeError = false;
  textFailed = '';
  imgValue = `${environment.imgs}register_denegate.PNG`;
  constructor(
    private geotabService: MyGeotabService,
    private loginService: LoginService,
    private shareService: ShareService,
    private roleService: RolesService,
    private userService: UsersService,
    private deviceService: DevicesService,
    private vehicleService: VehiclesService,
    private ngxLoader: NgxUiLoaderService,
    private ngxToast: ToastrService,
  ) { }

  ngOnInit() {
    this.init();
  }

  async init() {
    try {
      this.ngxLoader.startLoader('loader-init');
      const result: any = await this.geotabService.initGeotab();
      const login: any = await this.loginService.login(result.user);
      const loginData = login.data[0];

      if (!login.status) {
        this.textFailed = this.shareService.processMessage(login.result.message);
        this.ngxLoader.stopLoader('loader-init');
        this.seeError = true;
        return;
      }

      this.loginService.setSession(login.token);
      const modules: any = await this.roleService.getModules();
      const roles: any = await this.roleService.getRoles();
      const timeZones: any = await this.userService.getTimeZones();
      const allUsers: any = await this.userService.getAlllUsersData();

      const devicesST: any = await this.deviceService.getDevicesST();
      const vehicles: any = await this.vehicleService.getDevicesGO();

      const permissions: any = [];
      const findTimeZone = timeZones.findIndex(e => e.timezoneId === loginData.timezoneId);
      const findRole = roles.findIndex(e => e.rolesId === loginData.rolesId);
      loginData.timeZone = timeZones[findTimeZone];
      loginData.role = roles[findRole];

      const finstUs = _.findIndex(allUsers, e => e.userId === loginData.userId);
      allUsers.splice(finstUs, 1);

      this.shareService.setUser(loginData);
      this.shareService.setUsersList(allUsers);
      this.shareService.setGeotabUser(result.user);
      this.shareService.setGeotabUsersList(result.users);
      this.shareService.setModules(modules);
      this.shareService.setRoles(roles);
      this.shareService.setTimeZones(timeZones);
      this.shareService.setPermissions(permissions);
      this.shareService.setDevicesST(devicesST);
      this.shareService.setVehicles(vehicles);
      this.seeApp = true;
      this.ngxLoader.stopLoader('loader-init');
      this.subscribeToChanges();

    } catch (error) {
      console.log(error);
      this.textFailed = this.shareService.processMessage(error);
      console.log(this.shareService.processMessage(error))
      this.ngxLoader.stopLoader('loader-init');
      this.seeError = true;
    }
  }

  subscribeToChanges() {
    this.shareService.toastr.subscribe(toast => {
      if (toast) {
        switch (toast.type) {
          case 'success':
            this.ngxToast.success(toast.text, '', { timeOut: 5000, disableTimeOut: false });
            break;
          case 'info':
            this.ngxToast.info(toast.text);
            break;
          case 'warning':
            this.ngxToast.warning(toast.text);
            break;
          case 'error':
            this.ngxToast.error(toast.text);
            break;
          case 'autoclose':
            this.ngxToast.info(toast.text, '', { timeOut: 5000, disableTimeOut: false });
            break;
        }
      }
    });
  }
}
