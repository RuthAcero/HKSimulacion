import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ShareService } from 'src/app/services/Share/share.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Constants } from 'src/app/Constants';
import { UsersService } from 'src/app/services/Users/users.service';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @ViewChild('contentAddUser') contentAddEdit: ElementRef;
  @ViewChild('contentDeleteUser') contentDeleteUser: ElementRef;
  form = new FormGroup({});
  columns = Constants.columnsUsers;
  data = [];
  allData = [];
  lstDataSelect = [];
  lstRoles = [];
  dataDeleteSuccess = [];
  dataDeleteFailed = [];
  lstUsersGeotab = [];
  lstTimeZones = [];
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
  rolSelected = null;
  userGeotabSelected = null;
  permissions;

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private shareService: ShareService,
    private userService: UsersService,
    private ngxLoader: NgxUiLoaderService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.textLoader = 'Cargando...';
    this.ngxLoader.startLoader('loader-users');

    const permissions = this.shareService.getPermissions();
    this.permissions = { create: true, read: true, update: true, delete: true };
    this.editTable = true;
    this.deleteTable = true;

    this.lstTimeZones = this.shareService.getTimeZones();
    const users = this.shareService.getUsersList();
    const roles = this.shareService.getRoles();
    const usersGeotab = this.shareService.getGeotabUsersList();

    for (const item of users) {
      item.id = item.userId;
      if (!item.role) {
        const findRol = _.find(roles, e => e.roleId === item.roleId);
        item.role = findRol !== undefined && findRol !== null ? findRol : null;
      }

      if (item.timeZone) {
        const findTomeZones = _.find(this.lstTimeZones, e => e.timezoneId === item.timezoneId);
        item.timeZone = findTomeZones !== undefined && findTomeZones !== null ? findTomeZones : null;
      }

      const findUs = _.find(usersGeotab, e => e.userName === item.userName);
      usersGeotab.splice(findUs, 1);
    }

    this.rolSelected = roles.length ? roles[0] : null;
    this.data = _.orderBy(users, ['name'], ['asc']);;
    this.allData = _.orderBy(users, ['name'], ['asc']);
    this.lstUsersGeotab = _.orderBy(usersGeotab, ['name'], ['asc']);
    this.lstRoles = roles;
    this.ngxLoader.stopLoader('loader-users');
  }

  changeSelected() {
    if (this.userGeotabSelected !== null) {
      this.model = {
        userName: this.userGeotabSelected.userName, name: this.userGeotabSelected.name, lastName: this.userGeotabSelected.lastName,
        role: this.lstRoles.length ? this.lstRoles[0] : null, comments: '', timeZone: this.lstTimeZones.length ? this.lstTimeZones[0] : null,
      };
    } else {
      this.model = {
        userName: '', name: '', lastName: '', role: this.lstRoles.length ? this.lstRoles[0] : null, comments: ''
      };
    }
  }

  openCreate() {
    this.isCreate = true;
    this.titleModal = 'Agregar usuario';

    const usersGeotab = this.shareService.getGeotabUsersList();
    for (const item of this.data) {
      const findUs = _.findIndex(usersGeotab, e => e.userName === item.userName);
      if (findUs >= 0) {
        usersGeotab.splice(findUs, 1);
      }
    }

    this.lstUsersGeotab = _.orderBy(usersGeotab, ['name'], ['asc']);

    this.model = {
      userName: '', name: '', lastName: '', timeZone: this.lstTimeZones.length ? this.lstTimeZones[0] : null,
      role: this.lstRoles.length ? this.lstRoles[0] : null, comments: ''
    };
    this.initForms();
    this.modalOperation = this.modalService.open(this.contentAddEdit,
      { container: Constants.addin_container, centered: true, windowClass: 'modalFade' });
  }


  deleteList(content) {
    this.seeResultDelete = false;
    this.dataDeleteFailed = [];
    this.dataDeleteSuccess = [];
    this.titleModal = `Eliminar usuarios (${this.lstDataSelect.length})`;
    this.modalOperation = this.modalService.open(content,
      { container: Constants.addin_container, centered: true, size: 'lg', windowClass: 'modalFade' });
  }

  itemSelection(data) {
    if (data.type === 1) {

      const usersGeotab = this.shareService.getGeotabUsersList();
      for (const item of this.data) {
        const findUs = _.find(usersGeotab, e => e.userName === item.userName);
        usersGeotab.splice(findUs, 1);
      }
      this.lstUsersGeotab = _.orderBy(usersGeotab, ['name'], ['asc']);

      const item = data.data;
      this.itemSelected = item;
      this.rolSelected = item.rol;
      this.isCreate = false;
      this.titleModal = 'Editar usuario';
      this.model = {
        userName: item.userName, name: item.name, lastName: item.lastName, role: item.role, timeZone: item.timeZone, comments: item.comments ? item.comments : ''
      };
      this.initForms();
      this.modalOperation = this.modalService.open(this.contentAddEdit,
        { container: Constants.addin_container, centered: true, windowClass: 'modalFade' });
    } else {
      const item = data.data;
      this.itemSelected = item;
      this.isCreate = false;
      this.titleModal = `Eliminar usuario "${item.userName}"`;
      this.modalOperation = this.modalService.open(this.contentDeleteUser,
        { container: Constants.addin_container, centered: true, windowClass: 'modalFade' });
    }
  }

  selectionList(data) {
    this.lstDataSelect = data.data;
  }


  save() {
    this.isCreate ? this.saveData() : this.updateData();
  }

  async saveData() {
    try {

      const model = this.model;

      if (model.role === null) {
        this.shareService.showErrorToast('El usuario debe de tener asignado un rol');
        return;
      }

      this.seeTable = false;

      this.textLoader = 'Agregando';
      this.ngxLoader.startLoader('loader-user-add');

      const sendData = {
        userName: model.userName,
        name: model.name,
        lastName: model.lastName.trim(),
        roleId: model.role.roleId,
        comments: model.comments.trim(),
        timezoneId: model.timeZone.timezoneId,
        summertime: true
      };

      let result: any = await this.userService.addUserData(sendData);
      result = result.result;

      if (!result.status) {
        this.shareService.showErrorToast(result.message);
        this.ngxLoader.startLoader('loader-user-add');
        return
      }

      const data = this.data;
      data.push({ ...sendData, userId: result.data.userId, roleName: model.role.roleName, role: model.role, timeZone: model.timeZone });
      this.ngxLoader.stopLoader('loader-user-add');
      this.allData = _.orderBy(data, ['name'], ['asc']);
      this.data = _.orderBy(data, ['name'], ['asc']);
      this.data = this.data.slice();
      this.shareService.setUsersList(this.data)
      this.shareService.showSuccessToast(result.message);
      this.seeTable = true;
      this.closeModal();

    } catch (error) {
      this.seeTable = true;
      console.log(error);
      this.shareService.showErrorToast(error);
      this.ngxLoader.stopLoader('loader-user-add');
    }
  }


  async updateData() {
    try {

      const model = this.model, data = this.data;

      if (model.role === null) {
        this.shareService.showErrorToast('El usuario debe de tener asignado un rol');
        return;
      }

      this.seeTable = false;
      this.textLoader = 'Editando';
      this.ngxLoader.startLoader('loader-user-add');
      const item = this.itemSelected;
      const user = this.shareService.getUser();


      const sendData = {
        userName: model.userName,
        name: model.name,
        lastName: model.lastName.trim(),
        roleId: model.role.roleId,
        comments: model.comments.trim(),
        timezoneId: model.timeZone.timezoneId,
        summertime: this.itemSelected.summertime
      };


      let result: any = await this.userService.updateUser(sendData, item.userId);
      result = result.result;

      if (!result.status) {
        this.seeTable = true;
        this.ngxLoader.stopLoader('loader-user-add');
        this.shareService.showErrorToast(result.message);
        return;
      }


      const findUs = data.findIndex(e => e.userId === item.userId);
      data[findUs] = { ...sendData, userId: item.userId, roleName: model.role.roleName, role: model.role, timeZone: model.timeZone }

      this.ngxLoader.stopLoader('loader-user-add');
      this.shareService.setUsersList(data);
      this.data = _.orderBy(data, ['name'], ['asc']);
      this.data = this.data.slice();
      this.shareService.showSuccessToast(`Usuario "${sendData.name}" editado correctamente.`);
      this.seeTable = true;
      this.closeModal();
    } catch (error) {
      this.seeTable = true;
      this.ngxLoader.stopLoader('loader-user-add');
      this.shareService.showErrorToast(error);
    }
  }

  async deleteData() {
    try {
      this.seeTable = false;
      this.textLoader = 'Eliminando';
      this.ngxLoader.startLoader('loader-user-delete');
      const data = this.data;
      let result: any = await this.userService.deleteUser(this.itemSelected.userId);
      result = result.result;

      if (!result.status) {
        this.seeTable = true;
        this.ngxLoader.stopLoader('loader-user-delete');
        this.shareService.showErrorToast(result.message);
        return;
      }

      this.ngxLoader.stopLoader('loader-user-delete');
      const findUs = data.findIndex(e => e.userId === this.itemSelected.userId);
      data.splice(findUs, 1);

      this.shareService.setUsersList(data)
      this.data = _.orderBy(data, ['name'], ['asc']);
      this.data = this.data.slice();
      this.shareService.showSuccessToast(result.message);
      this.closeModal();
      this.itemSelected = null;
      this.seeTable = true;

    } catch (error) {
      this.seeTable = true;
      this.ngxLoader.startLoader('loader-user-delete');
      this.shareService.showErrorToast(error);
    }
  }

  async deleteDataList() {
    try {
      this.textLoader = 'Eliminando';
      this.ngxLoader.startLoader('loader-user-delete-list');
      this.seeTable = false;

      const result: any = await this.userService.deleteList(this.lstDataSelect);
      for (const item of result) {
        if (item.status) {
          this.dataDeleteSuccess.push(item)
        } else {
          this.dataDeleteFailed.push(item);
        }
      }

      this.seeResultDelete = true;

      let dataUsers: any = await this.userService.getAlllUsersData();

      for (const item of dataUsers) {
        const findRol = _.find(this.lstRoles, e => e.roleId === item.roleId);
        item.role = findRol !== undefined && findRol !== null ? findRol : null;
      }

      const myUser = this.shareService.getUser();
      const finstUs = _.findIndex(dataUsers, e => e.userId === myUser.userId);
      dataUsers.splice(finstUs, 1);

      this.data = _.orderBy(dataUsers, ['name'], ['asc']);
      this.data = this.data.slice();
      this.shareService.setUsersList(this.data)
      this.ngxLoader.stopLoader('loader-user-delete-list');
      this.lstDataSelect = [];
      this.seeTable = true;
    } catch (error) {
      this.seeTable = true;
      console.log(error);
      this.ngxLoader.startLoader('loader-user-delete-list');
      this.shareService.showErrorToast(error);
    }
  }

  closeModal() {
    this.modalOperation.close();
  }

  initForms() {
    this.fields = <FormlyFieldConfig>[
      {
        key: 'userName',
        type: 'input',
        templateOptions: {
          label: 'Nombre de usuario o correo electrónico',
          required: true,
          placeholder: 'Correo electrónico'
        },
        validators: {
          validation: ['noEmpty']
        },
      },
      {
        key: 'name',
        type: 'input',
        templateOptions: {
          label: 'Nombre',
          required: true,
          placeholder: 'Nombre'
        },
        validators: {
          validation: ['noEmpty']
        },
      },
      {
        key: 'lastName',
        type: 'input',
        templateOptions: {
          label: 'Apellidos',
          required: false,
          placeholder: 'Apellidos'
        }
      },
      {
        key: 'role',
        type: 'ngselect',
        templateOptions: {
          label: 'Selección de rol',
          options: this.lstRoles,
          bindLabel: 'roleName',
          notFoundText: 'No se encontraron roles',
          placeholder: 'Selección de rol',
          multiple: false,
          clearable: false,
        },
      },
      {
        key: 'timeZone',
        type: 'ngselect',
        templateOptions: {
          label: 'Selección de zona horaria',
          options: this.lstTimeZones,
          bindLabel: 'name',
          notFoundText: 'No se encontraron zonas horarias',
          placeholder: 'Selección de zona horaria',
          multiple: false,
          clearable: false,
        },
      },
      {
        key: 'comments',
        type: 'input',
        templateOptions: {
          label: 'Comentarios',
          required: false,
          placeholder: 'Comentarios'
        }
      }
    ]
  }
}
