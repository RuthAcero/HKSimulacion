import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ShareService } from 'src/app/services/Share/share.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Constants } from 'src/app/Constants';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UsersService } from 'src/app/services/Users/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() changeModule = new EventEmitter();
  form = new FormGroup({});
  lstTimeZones = [];
  activeNav = false;
  isSummerTime = false;
  itemMenuSelected = null;
  timeZoneSelected = null;
  userInfo;
  modalOperation;
  titleModal = '';
  fields;
  model;
  textLoader = '';

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
    this.userInfo = this.shareService.getUser();
    this.lstTimeZones = this.shareService.getTimeZones();
    this.selectInMenu(0);
  }

  selectInMenu(num) {
    if (this.itemMenuSelected !== num) {
      this.itemMenuSelected = num;
      this.changeModule.emit({ num: num });
    }
  }

  openModal(content) {
    console.log(this.userInfo, this.userInfo.role, this.userInfo.role.roleName);

    this.model = {
      userName: this.userInfo.userName, name: this.userInfo.name, lastName: this.userInfo.lastName,
      role: this.userInfo.role ? this.userInfo.role.roleName : '', comments: this.userInfo.comments ? this.userInfo.comments : ''
    };
    this.timeZoneSelected = this.userInfo.timeZone;
    this.isSummerTime = this.userInfo.summerTime;
    this.titleModal = 'Editar perfil'
    this.initForms();
    this.modalOperation = this.modalService.open(content, { container: Constants.addin_container, centered: true, windowClass: 'modalFade' });
  }

  async updateData() {
    try {

      const model = this.model;

      this.textLoader = 'Editando';
      this.ngxLoader.startLoader('loader-userLog');
      const item = this.userInfo;

      const sendData = {
        userName: model.userName,
        name: model.name,
        lastName: model.lastName.trim(),
        roleId: item.roleId,
        comments: model.comments.trim(),
        timezoneId: this.timeZoneSelected.timezoneId,
        summerTime: this.isSummerTime
      };


      let result: any = await this.userService.updateUser(sendData, item.userId);
      result = result.result;
      const userInfo = {
        userId: item.userId,
        role: item.role,
        timeZone: this.timeZoneSelected,
        ...sendData
      }

      this.userInfo = userInfo;
      this.ngxLoader.stopLoader('loader-userLog');
      this.shareService.setUser(userInfo);
      this.shareService.showSuccessToast(result.message);
      this.closeModal();
    } catch (error) {
      this.ngxLoader.stopLoader('loader-userLog');
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
        type: 'input',
        templateOptions: {
          label: 'Rol',
          required: false,
          placeholder: 'Rol'
        },
        expressionProperties: {
          'templateOptions.disabled': 'true',
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
