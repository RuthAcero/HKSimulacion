import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ShareService } from 'src/app/services/Share/share.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { VehiclesService } from 'src/app/services/Vehicles/vehicles.service';
import { MyGeotabService } from 'src/app/services/MyGeotab/my-geotab.service';
import { Constants } from 'src/app/Constants';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss']
})
export class UnitsComponent implements OnInit {
  @ViewChild('contentAddDeviceGO') contentAddEdit: ElementRef;
  @ViewChild('contentDeleteGO') contentDeleteUser: ElementRef;
  form = new FormGroup({});
  columns = Constants.columnsGO;
  lstDevices = [];
  data = [];
  allData = [];
  lstDataSelect = [];
  dataDeleteSuccess = [];
  dataDeleteFailed = [];
  lstDevicesGeotab = [];
  textFilter = '';
  textLoader = '';
  titleModal = '';
  fields;
  model;
  modalOperation;
  seeTable = true;
  editTable = true;
  deleteTable = true;
  exportTable = false;
  isCreate = false;
  seeResultDelete = false;
  seeForm = false;
  isImport = false;
  itemSelected = null;
  vehicleGeotabSelected = null;
  permissions;
  itemsMenu = [];
  devicesOcupped = [];

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private shareService: ShareService,
    private vehicleService: VehiclesService,
    private goeotabService: MyGeotabService,
    private ngxLoader: NgxUiLoaderService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.itemsMenu = [
      {
        label: 'Importar', icon: 'pi pi-fw pi-search-plus', command: () => {
          this.openCreate();
        }
      },
      {
        label: 'Crear', icon: 'pi pi-fw pi-plus', command: () => {
          this.openCreateGO();
        }
      },
    ];
    this.initData();
  }

  async initData() {
    this.textLoader = 'Cargando...';
    this.ngxLoader.startLoader('loader-units');
    const vehicle = this.shareService.getVehicles(), devices = this.shareService.getDevicesST(),
      goDevices: any = await this.goeotabService.getDevices(), auxItems = [], devicesInList = [];
    devices.map(e => e.id = e.suntechId);
    for (const item of vehicle) {
      const findGo = _.findIndex(goDevices, e => e.id === item.goId);

      if (findGo >= 0) {
        item.name = goDevices[findGo].name;
        item.serialNumber = goDevices[findGo].serialNumber;
        item.vin = goDevices[findGo].vin ? goDevices[findGo].vin : '';
        item.plate = goDevices[findGo].plate ? goDevices[findGo].plat : '';

        const findDevice = _.findIndex(devices, e => e.id === item.deviceId);
        item.device = findDevice >= 0 ? devices[findDevice] : null;
        item.deviceName = findDevice >= 0 ? devices[findDevice].name : '';

        if (findDevice >= 0) {
          devicesInList.push(devices[findDevice].suntechId);
        }
        auxItems.push(item);
      } else {
        console.log(item);
        item.name = 'SIN REGISTRO';
        item.serialNumber = 'SIN REGISTRO';
        item.vin = 'SIN REGISTRO';
        item.plate = 'SIN REGISTRO';

        const findDevice = _.findIndex(devices, e => e.id === item.deviceId);
        item.device = findDevice >= 0 ? devices[findDevice] : null;
        item.deviceName = findDevice >= 0 ? devices[findDevice].name : '';

        if (findDevice >= 0) {
          devicesInList.push(devices[findDevice].suntechId);
        }
        auxItems.push(item);
      }
    }
    this.devicesOcupped = devicesInList;
    //this.lstDevices = devices;
    this.data = auxItems;
    this.ngxLoader.stopLoader('loader-units');
  }

  async openCreateGO() {
    this.isImport = true;
    this.modalOperation = this.modalService.open(this.contentAddEdit,
      { container: Constants.addin_container, centered: true, windowClass: 'modalFade' });
    this.initForms(false);
    this.model = { name: '', serialNumber: '', plate: '', vin: '', };
  }

  async openCreate() {
    this.isImport = false;
    this.seeForm = false;
    this.isCreate = true;
    this.titleModal = 'Agregar vehículo';
    this.textLoader = 'Cargando...';
    this.modalOperation = this.modalService.open(this.contentAddEdit,
      { container: Constants.addin_container, centered: true, windowClass: 'modalFade' });
    this.ngxLoader.startLoader('loader-go-add');
    const devices = this.shareService.getDevicesST();
    this.lstDevices = this.data.length ? <Array<any>>this.suntechsDis(devices) : devices;
    const devGo = <Array<any>>await this.goeotabService.getDevices();
    this.lstDevicesGeotab = this.data.length ? await this.existInArray(devGo) : devGo;
    this.vehicleGeotabSelected = null;
    this.model = { name: '', serialNumber: '', plate: '', vin: '', device: null };
    this.initForms(true);
    this.seeForm = true;
    this.ngxLoader.stopLoader('loader-go-add');
  }

  async existInArray(devGo) {
    const auxDevs = [];
    for (const item of devGo) {
      if (_.findIndex(this.data, e => e.goId === item.id) < 0) {
        auxDevs.push(item);
      }
    }
    return auxDevs;
  }

  suntechsDis(devices) {
    const auxDevs = [];
    for (const item of devices) {
      if (_.findIndex(this.devicesOcupped, e => e === item.suntechId) < 0) {
        auxDevs.push(item);
      }
    }
    return auxDevs;
  }

  changeSelected() {
    if (this.vehicleGeotabSelected !== null) {
      const item = this.vehicleGeotabSelected;
      this.model = {
        name: item.name, serialNumber: item.serialNumber, plate: item.plate, vin: item.vin, device: null
      };
    } else {
      this.model = { name: '', serialNumber: '', plate: '', vin: '', device: null };
    }
  }

  selectionList(data) {

  }

  async itemSelection(data) {
    if (data.type === 1) {
      this.textLoader = 'Cargando...';
      this.modalOperation = this.modalService.open(this.contentAddEdit,
        { container: Constants.addin_container, centered: true, windowClass: 'modalFade' });
      this.ngxLoader.startLoader('loader-go-add');
      const item = data.data;
      this.itemSelected = item;
      this.isCreate = false;
      this.isImport = false;
      this.titleModal = 'Editar vehículo'
        ;
      const devices = this.shareService.getDevicesST();
      this.lstDevices = this.data.length ? <Array<any>>this.suntechsDis(devices) : devices;
      const devGo = <Array<any>>await this.goeotabService.getDevices();
      this.lstDevicesGeotab = this.data.length ? await this.existInArray(devGo) : devGo;

      const findGo = _.findIndex(devGo, e => e.id === item.goId);
      if (findGo >= 0) {
        this.vehicleGeotabSelected = devGo[findGo];
        this.lstDevicesGeotab.push(devGo[findGo]);
      } else {
        this.vehicleGeotabSelected = null;
      }

      if (item.device !== null) {
        this.lstDevices.push(item.device);
      }

      this.model = { name: item.name, serialNumber: item.serialNumber, plate: item.plateNumber, vin: item.vin, device: item.device };
      this.initForms(true);
      this.ngxLoader.stopLoader('loader-go-add');

    } else {
      const item = data.data;
      this.itemSelected = item;
      this.isCreate = false;
      this.titleModal = `Eliminar vehículo "${item.name}"`;
      this.modalOperation = this.modalService.open(this.contentDeleteUser,
        { container: Constants.addin_container, centered: true, windowClass: 'modalFade' });
    }
  }

  save() {
    this.isCreate ? this.saveData() : this.updateData();
  }

  async saveData() {
    try {

      const model = this.model;

      if (this.vehicleGeotabSelected === null) {
        return;
      }

      this.seeTable = false;
      this.textLoader = 'Agregando';
      this.ngxLoader.startLoader('loader-go-add');

      const sendData = {
        goId: this.vehicleGeotabSelected.id,
        deviceId: model.device === null ? null : model.device.id
      };

      let result: any = await this.vehicleService.addGO(sendData);
      result = result.result;
      console.log(result);
      if (!result.status) {
        this.seeTable = true;
        this.shareService.showErrorToast(result.message);
        this.ngxLoader.stopLoader('loader-go-add');
        return
      }

      const data = this.data, item = this.vehicleGeotabSelected;

      data.push({
        ...sendData,
        id: result.data.id,
        device: model.device,
        deviceName: model.device !== null ? model.device.name : '',
        name: item.name, serialNumber: item.serialNumber, plate: item.plate, vin: item.vin
      });


      if (model.device !== null) {
        this.devicesOcupped.push(model.device.suntechId)
      }

      console.log(this.devicesOcupped);
      this.ngxLoader.stopLoader('loader-go-add');
      this.allData = _.orderBy(data, ['name'], ['asc']);
      this.data = _.orderBy(data, ['name'], ['asc']);
      this.data = this.data.slice();
      this.shareService.setVehicles(this.data)
      this.shareService.showSuccessToast(result.message);
      this.seeTable = true;
      this.closeModal();
    } catch (error) {
      this.seeTable = true;
      console.log(error);
      this.shareService.showErrorToast(error);
      this.ngxLoader.stopLoader('loader-go-add');
    }
  }


  async saveCreateData() {
    try {

      const model = this.model;
      this.seeTable = false;
      this.textLoader = 'Creando';
      this.ngxLoader.startLoader('loader-go-add');

      const sendData = {
        name: model.name.trim(),
        serialNumber: model.serialNumber.trim(),
        plate: model.plate.trim(),
        vin: model.vin.trim(),
        deviceId: model.device === null ? null : model.device.id
      };

      let result: any = await this.vehicleService.createGO(sendData);
      result = result.result;

      if (!result.status) {
        this.seeTable = true;
        this.shareService.showErrorToast(result.message);
        this.ngxLoader.stopLoader('loader-go-add');
        return
      }

      const data = this.data;

      data.push({
        ...sendData,
        id: result.data.id,
        device: model.device,
        deviceId: model.device.suntechId,
        goId: this.vehicleGeotabSelected.id,
        deviceName: model.device !== null ? model.device.name : ''
      });

      if (model.device !== null) {
        this.devicesOcupped.push(model.device.suntechId)
      }

      console.log(this.devicesOcupped);
      this.ngxLoader.stopLoader('loader-go-add');
      this.allData = _.orderBy(data, ['name'], ['asc']);
      this.data = _.orderBy(data, ['name'], ['asc']);
      this.data = this.data.slice();
      this.shareService.setVehicles(this.data)
      this.shareService.showSuccessToast(result.message);
      this.seeTable = true;
      this.closeModal();
    } catch (error) {
      this.seeTable = true;
      console.log(error);
      this.shareService.showErrorToast(error);
      this.ngxLoader.stopLoader('loader-go-add');
    }
  }

  async updateData() {
    try {

      const model = this.model;


      if (this.vehicleGeotabSelected === null) {
        return;
      }

      this.seeTable = false;
      this.textLoader = 'Agregando';
      this.ngxLoader.startLoader('loader-go-add');

      const sendData = {
        idGo: this.vehicleGeotabSelected.id,
        deviceId: model.device === null ? null : model.device.id
      };


      let result: any = await this.vehicleService.updateGO(sendData, this.itemSelected.id);
      result = result.result;

      if (!result.status) {
        this.seeTable = true;
        this.shareService.showErrorToast(result.message);
        this.ngxLoader.stopLoader('loader-go-add');
        return
      }

      const data = this.data;
      const findDev = _.findIndex(data, e => e.id === this.itemSelected.id);

      if (findDev >= 0) {
        data[findDev] = {
          ...sendData,
          id: this.itemSelected.id,
          device: model.device,
          goId: this.vehicleGeotabSelected.id,
          name: model.name, serialNumber: model.serialNumber, plate: model.plate, vin: model.vin
        }
      }

      this.devicesOcupped = [];
      const devicesInList = [], devices = this.shareService.getDevicesST();
      for (const item of data) {
        const findDevice = _.findIndex(devices, e => e.id === item.deviceId);
        item.device = findDevice >= 0 ? devices[findDevice] : null;
        item.deviceName = findDevice >= 0 ? devices[findDevice].name : '';

        if (findDevice >= 0) {
          devicesInList.push(devices[findDevice].suntechId);
        }
      }

      this.devicesOcupped = devicesInList;
      this.ngxLoader.stopLoader('loader-go-add');
      this.allData = _.orderBy(data, ['name'], ['asc']);
      this.data = _.orderBy(data, ['name'], ['asc']);
      this.data = this.data.slice();
      this.shareService.setVehicles(this.data)
      this.shareService.showSuccessToast(result.message);
      this.seeTable = true;
      this.closeModal();

    } catch (error) {
      this.seeTable = true;
      console.log(error);
      this.shareService.showErrorToast(error);
      this.ngxLoader.stopLoader('loader-go-add');
    }
  }


  async deleteData() {
    try {
      this.seeTable = false;
      this.textLoader = 'Eliminando';
      this.ngxLoader.startLoader('loader-go-delete');
      const data = this.data;

      let result: any = await this.vehicleService.deleteGO(this.itemSelected.id);
      result = result.result;

      if (!result.status) {
        this.seeTable = true;
        this.ngxLoader.stopLoader('loader-go-delete');
        this.shareService.showErrorToast(result.message);
        return;
      }

      this.ngxLoader.stopLoader('loader-go-delete');
      const findUs = data.findIndex(e => e.id === this.itemSelected.id);
      data.splice(findUs, 1);

      this.devicesOcupped = [];
      const devicesInList = [], devices = this.shareService.getDevicesST();
      for (const item of data) {
        const findDevice = _.findIndex(devices, e => e.id === item.deviceId);
        item.device = findDevice >= 0 ? devices[findDevice] : null;
        item.deviceName = findDevice >= 0 ? devices[findDevice].name : '';

        if (findDevice >= 0) {
          devicesInList.push(devices[findDevice].suntechId);
        }
      }


      this.devicesOcupped = devicesInList;
      this.shareService.setVehicles(data)
      this.data = _.orderBy(data, ['name'], ['asc']);
      this.data = this.data.slice();
      this.shareService.showSuccessToast(result.message);
      this.closeModal();
      this.itemSelected = null;
      this.seeTable = true;

    } catch (error) {
      this.seeTable = true;
      this.ngxLoader.startLoader('loader-go-delete');
      this.shareService.showErrorToast(error);
    }
  }

  closeModal() {
    this.modalOperation.close();
  }

  initForms(isDisabled) {
    this.fields = <FormlyFieldConfig>[
      {
        key: 'name',
        type: 'input',
        templateOptions: {
          label: 'Económico',
          required: true,
          placeholder: 'Económico'
        },
        expressionProperties: {
          'templateOptions.disabled': String(isDisabled),
        },
        validators: {
          validation: ['noEmpty']
        },
      },
      {
        key: 'serialNumber',
        type: 'input',
        templateOptions: {
          label: 'Número serial',
          required: true,
          placeholder: 'Número Serial'
        },
        validators: {
          validation: ['noEmpty']
        },
        expressionProperties: {
          'templateOptions.disabled': String(isDisabled),
        },
      },
      {
        key: 'vin',
        type: 'input',
        templateOptions: {
          label: 'VIN',
          required: false,
          placeholder: 'VIN'
        },
        expressionProperties: {
          'templateOptions.disabled': String(isDisabled),
        },
      },
      {
        key: 'plate',
        type: 'input',
        templateOptions: {
          label: 'Placa',
          required: false,
          placeholder: 'Placa'
        }, expressionProperties: {
          'templateOptions.disabled': String(isDisabled),
        },
      },
      {
        key: 'device',
        type: 'ngselect',
        templateOptions: {
          label: 'Selección de dispositivo',
          options: this.lstDevices,
          bindLabel: 'name',
          notFoundText: 'No se encontraron dispositivos',
          placeholder: 'Selección de dispositivo',
          multiple: false,
          clearable: true,
          positionDrop: 'top'
        },
      },
    ]
  }
}
