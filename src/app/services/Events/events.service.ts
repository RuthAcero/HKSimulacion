import { EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root'
})
export class EventsService {


  varOptionSelect: Subscription;
  invokeOptionSelect = new EventEmitter();


  varListDevices: Subscription;
  invokeListDevices = new EventEmitter();

  varDeviceSelect: Subscription;
  invokeDeviceSelect = new EventEmitter();
  
  varDeviceSelectInfoList: Subscription;
  constructor() { }


  activeDevicesList(list) {
    this.invokeListDevices.emit(list);
  }

  activeSelectDevice(item) {
    this.invokeDeviceSelect.emit(item);
  }

  activeOptionSelected(item) {
    this.invokeOptionSelect.emit(item);
  }
}
