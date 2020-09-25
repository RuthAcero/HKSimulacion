import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShareService } from 'src/app/services/Share/share.service';
import { RolesService } from 'src/app/services/Roles/roles.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Constants } from 'src/app/Constants';
import * as _ from 'lodash';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})

export class RolesComponent implements OnInit {
  lstRoles = [];
  lstModules = [];
  permissions = [];
  columns = Constants.columnsRoles;
  rolSelect = null;
  editable = false;
  create = false;
  seeTable = false;
  nameRol = '';
  textLoader = '';
  titleModal = '';
  newPermissions = [];
  modalOperation;
  permissionsUser;

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private shareService: ShareService,
    private roleService: RolesService,
    private ngxLoader: NgxUiLoaderService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.initData();
  }

  initData() {
    const permissions = this.shareService.getPermissions();
    //this.permissionsUser = permissions.rules;
    this.permissionsUser = { create: true, read: true, update: true, delete: true, download: true };
    this.lstRoles = this.shareService.getRoles();
    this.lstRoles = _.orderBy(this.lstRoles, ['roleName'], ['asc'])
    this.lstModules = this.shareService.getModules();
  }

  editRole() {
    this.editable = true;
    this.nameRol = this.rolSelect.roleName;
  }

  changeRol() {
    if (this.rolSelect) {
      const findRol = this.rolSelect;
      const permissions = findRol.permissions;
      const modules = this.lstModules.map(e => ({
        moduleId: e.moduleId, moduleName: e.moduleName, write: false, read: false, edit: false, delete: false, download: false
      }))

      this.nameRol = findRol.rolName;
      this.permissions = permissions !== [] ? _.orderBy(permissions.map(e => ({
        moduleId: e.moduleId, moduleName: e.moduleName, write: e.write, read: e.read, edit: e.edit, delete: e.delete, download: e.download,
      })), ['moduleName'], ['asc']) : _.orderBy(modules, ['moduleName'], ['asc']);

      this.seeTable = true;
    } else {
      this.permissions = [];
    }
  }

  createRol() {
    this.nameRol = '';
    const modules = this.lstModules.map(e => ({
      moduleId: e.moduleId, moduleName: e.moduleName, write: false, read: false, edit: false, delete: false, download: false
    }));
    this.seeTable = true;

    this.permissions = _.orderBy(modules, ['moduleName'], ['asc']);
    this.create = true;
  }


  openDelete(content) {
    this.titleModal = `¿Desea eliminar el siguiente rol "${this.rolSelect.roleName}"?`
    this.modalOperation = this.modalService.open(content, {
      container: Constants.addin_container, centered: true, windowClass: 'modalFade'
    })
  }

  save() {
    this.create ? this.saveData() : this.updateData();
  }

  async saveData() {
    try {
      if (this.nameRol.trim() === '') {
        this.shareService.showErrorToast('El nombre del rol es requerido');
        return;
      }

      const findName = _.findIndex(this.lstRoles, e => e.roleName === this.nameRol.trim());

      if (findName >= 0) {
        this.shareService.showErrorToast(`El rol con nombre ${this.nameRol.trim()} ya se encuentra registrado.`);
        return;
      }

      this.textLoader = 'Agregando';
      this.ngxLoader.startLoader('loader-roles');
      this.seeTable = false;

      let data = {
        roleName: this.nameRol.trim(),
        permissions: this.newPermissions
      };


      let result: any = await this.roleService.addRole(data);
      result = result.result;

      if (!result.status) {
        this.shareService.showErrorToast(result.message);
        this.ngxLoader.stopLoader('loader-roles');
        return
      }

      const sendData = { ...data, roleId: result.data ? result.data.roleId : null };
      this.lstRoles.push(sendData);
      this.lstRoles = this.lstRoles.slice();
      this.rolSelect = sendData;
      this.shareService.setRoles(this.lstRoles);
      this.create = false;
      this.editable = false;
      this.seeTable = true;
      this.changeRol();
      this.ngxLoader.stopLoader('loader-roles');
      this.shareService.showSuccessToast(result.message);
      console.log(sendData);
    } catch (error) {
      this.seeTable = true;
      this.shareService.showErrorToast(error);
      this.ngxLoader.stopLoader('loader-roles');
    }

  }

  async updateData() {
    try {
      if (this.nameRol.trim() === '') {
        this.shareService.showErrorToast('El nombre del rol es requerido');
        return;
      }

      this.textLoader = 'Editando';
      this.ngxLoader.startLoader('loader-roles');

      const sendData = {
        roleName: this.nameRol.trim(),
        permissions: this.newPermissions,
      };

      let resultData: any = await this.roleService.editRole(sendData, this.rolSelect.roleId);
      resultData = resultData.result;

      if (!resultData.status) {
        this.ngxLoader.stopLoader('loader-roles');
        this.shareService.showErrorToast(resultData.message);
        return;
      }

      const findRol = _.findIndex(this.lstRoles, e => e.roleId === this.rolSelect.roleId);
      const pushData = { roleId: this.rolSelect.roleId, ...sendData };
      this.lstRoles[findRol] = pushData;
      this.lstRoles = this.lstRoles.slice();
      this.rolSelect = pushData;
      this.shareService.setRoles(this.lstRoles);
      this.create = false;
      this.editable = false;
      this.seeTable = true;
      this.changeRol();
      this.ngxLoader.stopLoader('loader-roles');
      this.shareService.showSuccessToast(resultData.message);

    } catch (error) {
      this.ngxLoader.stopLoader('loader-roles');
      this.shareService.showErrorToast(error);
    }
  }

  async deleteData() {
    try {
      this.closeModal();
      this.textLoader = 'Eliminando';
      this.ngxLoader.startLoader('loader-roles');
      let resultData: any = await this.roleService.deleteRole(this.rolSelect.roleId);
      resultData = resultData.result;

      if (!resultData.status) {
        this.shareService.showErrorToast(resultData.message);
        this.ngxLoader.stopLoader('loader-roles');
        return
      }

      const findRol = _.findIndex(this.lstRoles, e => e.roleId === this.rolSelect.roleId);
      this.lstRoles.splice(findRol, 1);
      this.lstRoles = this.lstRoles.slice();
      this.create = false;
      this.editable = false;
      this.seeTable = false;
      this.ngxLoader.stopLoader('loader-roles');
      this.shareService.setRoles(this.lstRoles);
      this.shareService.showSuccessToast(resultData.message);
      this.rolSelect = null;

    } catch (error) {
      this.shareService.showErrorToast(error);
      this.ngxLoader.stopLoader('loader-roles');

    }
  }

  cancel() {
    this.seeTable = false;
    this.create = false;
    this.editable = false;
    this.permissions = [];
    this.changeRol();
  }

  closeModal() {
    this.modalOperation.close();
  }

  changePermissions(data) {
    this.newPermissions = data.permissions;
  }

}
