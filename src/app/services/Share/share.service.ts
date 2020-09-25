import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  public toastr = new BehaviorSubject(null);
  public user = new BehaviorSubject(null);
  public goUser = new BehaviorSubject(null);
  public permissions = new BehaviorSubject([]);
  public modules = new BehaviorSubject([]);
  public roles = new BehaviorSubject([]);
  public users = new BehaviorSubject([]);
  public goUserList = new BehaviorSubject([]);
  public timeZones = new BehaviorSubject([]);
  public devicesST = new BehaviorSubject([]);
  public vehicles = new BehaviorSubject([]);


  constructor() { }

  setUser(usr) {
    this.user.next(usr);
  }

  getUser() {
    return this.user.value;
  }

  setGeotabUser(usr) {
    this.goUser.next(usr);
  }

  getGeotabUser() {
    return this.goUser.value;
  }

  setGeotabUsersList(usr) {
    this.goUserList.next(usr);
  }

  getGeotabUsersList() {
    return this.goUserList.value;
  }

  setPermissions(per) {
    this.permissions.next(per);
  }

  getPermissions() {
    return this.permissions.value;
  }

  setModules(mds) {
    this.modules.next(mds);
  }

  getModules() {
    return this.modules.value;
  }

  setRoles(rls) {
    this.roles.next(rls);
  }

  getRoles() {
    return this.roles.value;
  }

  setUsersList(usrs) {
    this.users.next(usrs);
  }

  getUsersList() {
    return this.users.value;
  }

  setTimeZones(tzs) {
    this.timeZones.next(tzs);
  }

  getTimeZones() {
    return this.timeZones.value;
  }

  setDevicesST(data) {
    this.devicesST.next(data);
  }

  getDevicesST() {
    return this.devicesST.value;
  }

  setVehicles(data) {
    this.vehicles.next(data);
  }

  getVehicles() {
    return this.vehicles.value;
  }

  showSuccessToast(content: string) {
    this.toastr.next({ type: 'success', text: this.processMessage(content) });
  }

  showInfoToast(content: string) {
    this.toastr.next({ type: 'info', text: this.processMessage(content) });
  }

  showWarningToast(content: string) {
    this.toastr.next({ type: 'warning', text: this.processMessage(content) });
  }

  showErrorToast(content: string) {
    this.toastr.next({ type: 'error', text: this.processMessage(content) });
  }

  showInfoToastAutoClose(content: string) {
    this.toastr.next({ type: 'autoclose', text: this.processMessage(content) });
  }

  showErrorToastRequest(content: string) {
    this.toastr.next({ type: 'error', text: this.processMessage(content) });
  }


  processMessage(message) {
    if (typeof message === 'string') {
      return message;
    } else if (typeof message === 'object') {
      if (message['error']) {
        if (typeof message['error'] === 'object') {
          if (message['error']['error']) {
            return message['error']['error'];
          } else if (message['error']['message']) {
            return message['error']['message'];
          } else if (message['error']['msg']) {
            return message['error']['msg'];
          }
        } else {
          return message['error'];
        }
      } else if (message['message']) {
        return message['message'];
      } else {
        return JSON.stringify(message);
      }
    }
  }
}
