import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ShareService } from 'src/app/services/Share/share.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DevicesService } from 'src/app/services/Devices/devices.service';
import { Constants } from 'src/app/Constants';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {
  @ViewChild('contentAddDeviceST') contentAddEdit: ElementRef;
  @ViewChild('contentDeleteST') contentDeleteUser: ElementRef;
  form = new FormGroup({});
  columns = Constants.columnsST;
  data = [];
  allData = [];
  lstDataSelect = [];
  dataDeleteSuccess = [];
  dataDeleteFailed = [];
  lstDevices = [];
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
  itemSelected = null;
  permissions;


  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private shareService: ShareService,
    private deviceService: DevicesService,
    private ngxLoader: NgxUiLoaderService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.initData();
  }

  initData() {
    const data = this.shareService.getDevicesST();
    data.map(e => e.id = e.suntechId);
    this.data = _.orderBy(data, ['name'], ['asc']);
    console.log(this.data);
  }

  openCreate() {
    this.isCreate = true;
    this.titleModal = 'Agregar dispositivo';
    this.model = { name: '', imei: '', imeiCut: '', plate: '', comments: '' };

    this.initForms();
    this.modalOperation = this.modalService.open(this.contentAddEdit,
      { container: Constants.addin_container, centered: true, windowClass: 'modalFade' });
  }


  deleteList(content) {
    this.seeResultDelete = false;
    this.dataDeleteFailed = [];
    this.dataDeleteSuccess = [];
    this.titleModal = `Eliminar dispositivos (${this.lstDataSelect.length})`;
    this.modalOperation = this.modalService.open(content,
      { container: Constants.addin_container, centered: true, size: 'lg', windowClass: 'modalFade' });
  }

  selectionList(data) {
    this.lstDataSelect = data.data;
  }

  itemSelection(data) {
    if (data.type === 1) {
      const item = data.data;
      this.itemSelected = item;
      this.isCreate = false;
      this.titleModal = 'Editar dispositivo';
      this.model = { name: item.name, imei: item.imei, imeiCut: item.imeiCut, plate: item.plate, comments: item.comments ? item.comments : '' };
      this.initForms();
      this.modalOperation = this.modalService.open(this.contentAddEdit,
        { container: Constants.addin_container, centered: true, windowClass: 'modalFade' });

    } else {
      const item = data.data;
      this.itemSelected = item;
      this.isCreate = false;
      this.titleModal = `Eliminar dispositivo "${item.name}"`;
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

      this.seeTable = false;
      this.textLoader = 'Agregando';
      this.ngxLoader.startLoader('loader-dvst-add');

      const sendData = {
        name: model.name.trim(),
        imei: model.imei.trim(),
        imeiCut: model.imeiCut.trim(),
        plate: model.plate.trim(),
        comments: model.comments.trim(),
      };

      let result: any = await this.deviceService.addST(sendData);
      result = result.result;

      if (!result.status) {
        this.seeTable = true;
        this.shareService.showErrorToast(result.message);
        this.ngxLoader.stopLoader('loader-dvst-add');
        return
      }

      const data = this.data;
      data.push({ ...sendData, id: result.data.suntechId, suntechId: result.data.suntechId });
      this.ngxLoader.stopLoader('loader-dvst-add');
      this.allData = _.orderBy(data, ['name'], ['asc']);
      this.data = _.orderBy(data, ['name'], ['asc']);
      this.data = this.data.slice();
      this.shareService.setDevicesST(data)
      this.shareService.showSuccessToast(result.message);
      this.seeTable = true;
      this.closeModal();

    } catch (error) {
      this.seeTable = true;
      console.log(error);
      this.shareService.showErrorToast(error);
      this.ngxLoader.stopLoader('loader-dvst-add');
    }
  }

  async updateData() {
    try {

      const model = this.model;

      this.seeTable = false;
      this.textLoader = 'Editando';
      this.ngxLoader.startLoader('loader-dvst-add');

      const sendData = {
        name: model.name.trim(),
        imei: model.imei.trim(),
        imeiCut: model.imeiCut.trim(),
        plate: model.plate.trim(),
        comments: model.comments.trim(),
      };

      let result: any = await this.deviceService.updateST(sendData, this.itemSelected.id);
      result = result.result;
      if (!result.status) {
        this.seeTable = true;
        this.shareService.showErrorToast(result.message);
        this.ngxLoader.stopLoader('loader-dvst-add');
        return
      }

      const data = this.data;
      const findDev = _.findIndex(data, e => e.id === this.itemSelected.id);

      if (findDev >= 0) {
        data[findDev] = {
          ...sendData,
          id: this.itemSelected.id,
          suntechId: this.itemSelected.id,
        }
      }

      this.ngxLoader.stopLoader('loader-dvst-add');
      this.allData = _.orderBy(data, ['name'], ['asc']);
      this.data = _.orderBy(data, ['name'], ['asc']);
      this.data = this.data.slice();
      this.shareService.setDevicesST(this.data)
      this.shareService.showSuccessToast(result.message);
      this.seeTable = true;
      this.closeModal();

    } catch (error) {
      this.seeTable = true;
      console.log(error);
      this.shareService.showErrorToast(error);
      this.ngxLoader.stopLoader('loader-dvst-add');
    }
  }

  async deleteData() {
    try {
      this.seeTable = false;
      this.textLoader = 'Eliminando';
      this.ngxLoader.startLoader('loader-st-delete');
      const data = this.data;

      let result: any = await this.deviceService.deleteST(this.itemSelected.id);
      result = result.result;

      if (!result.status) {
        this.seeTable = true;
        this.ngxLoader.stopLoader('loader-st-delete');
        this.shareService.showErrorToast(result.message);
        return;
      }

      this.ngxLoader.stopLoader('loader-st-delete');
      const findUs = data.findIndex(e => e.id === this.itemSelected.id);
      data.splice(findUs, 1);

      this.shareService.setDevicesST(data)
      this.data = _.orderBy(data, ['name'], ['asc']);
      this.data = this.data.slice();
      this.shareService.showSuccessToast(result.message);
      this.closeModal();
      this.itemSelected = null;
      this.seeTable = true;

    } catch (error) {
      this.seeTable = true;
      this.ngxLoader.startLoader('loader-st-delete');
      this.shareService.showErrorToast(error);
    }
  }

  async deleteDataList() {
    try {
      this.textLoader = 'Eliminando';
      this.ngxLoader.startLoader('loader-st-delete-list');
      this.seeTable = false;

      const result: any = await this.deviceService.deleteList(this.lstDataSelect);
      for (const item of result) {
        if (item.status) {
          this.dataDeleteSuccess.push(item)
        } else {
          this.dataDeleteFailed.push(item);
        }
      }

      this.seeResultDelete = true;

      let dataDev = await this.deviceService.getDevicesST();
      dataDev.map(e => e.id = e.suntechId);
      this.data = _.orderBy(dataDev, ['name'], ['asc']);
      this.data = this.data.slice();
      this.shareService.setDevicesST(this.data)
      this.ngxLoader.stopLoader('loader-st-delete-list');
      this.lstDataSelect = [];
      this.seeTable = true;
    } catch (error) {
      this.seeTable = true;
      console.log(error);
      this.ngxLoader.startLoader('loader-st-delete-list');
      this.shareService.showErrorToast(error);
    }
  }

  closeModal() {
    this.modalOperation.close();
  }

  initForms() {
    this.fields = <FormlyFieldConfig>[
      {
        key: 'name',
        type: 'input',
        templateOptions: {
          label: 'Económico',
          required: true,
          placeholder: 'Económico'
        },
        validators: {
          validation: ['noEmpty']
        },
      },
      {
        key: 'imei',
        type: 'input',
        templateOptions: {
          label: 'IMEI',
          required: true,
          placeholder: 'IMEI'
        },
        validators: {
          validation: ['noEmpty', 'noMinLength', 'noMaxLength']
        },
      },
      {
        key: 'imeiCut',
        type: 'input',
        templateOptions: {
          label: 'IMEI-CUT',
          required: true,
          placeholder: 'IMEI-CUT'
        },

        validators: {
          validation: ['noEmpty']
        },
      },
      {
        key: 'plate',
        type: 'input',
        templateOptions: {
          label: 'Placa',
          required: false,
          placeholder: 'Placa'
        },
      },
      {
        key: 'comments',
        type: 'input',
        templateOptions: {
          label: 'Comentarios',
          required: false,
          placeholder: 'Comentarios'
        },
      },

    ]
  }
}
