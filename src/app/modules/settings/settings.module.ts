import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainSettingsComponent } from './components/main-settings/main-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GroupsComponent } from './components/groups/groups.component';
import { UsersComponent } from './components/users/users.component';
import { DevicesComponent } from './components/devices/devices.component';
import { UnitsComponent } from './components/units/units.component';
import { RolesComponent } from './components/roles/roles.component';
import { ToolsModule } from '../tools/tools.module';
import { FaIconsModule } from '../fa-icons/fa-icons.module';
import { TablesModule } from '../tables/tables.module';


import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlySelectComponent } from './formly-components/formly-select/formly-select.component';

export function requiredMessage(error, field) {
  return `Campo requerido`;
}

export function isNotEmptyMessage(error, field) {
  return `Campo requerido, datos no válidos`;
}

export function minLengthMessage(error, field) {
  return `Número mínimo de caracteres es 15.`;
}

export function maxLengthMessage(error, field) {
  return `Máximo de caracteres es 15.`;
}


export function isNotEmpty(control) {
  const texto = control.value.replace(/^\s+|\s+$|\s+(?=\s)/g, "")
  texto.trim();
  return texto != '' ? null : { 'noEmpty': true };
}

export function minLength(control) {
  console.log(control.value, control.value.length);
  return control.value.length >= 15 ? null : { 'noMinLength': true };
}

export function maxLength(control) {
  return control.value.length <= 15 ? null : { 'noMaxLength': true };
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToolsModule,
    FaIconsModule,
    TablesModule,
    FormlyModule.forRoot({
      validators: [
        { name: 'noEmpty', validation: isNotEmpty },
        { name: 'noMinLength', validation: minLength },
        { name: 'noMaxLength', validation: maxLength }
      ],
      validationMessages: [
        { name: 'required', message: requiredMessage },
        { name: 'noEmpty', message: isNotEmptyMessage },
        { name: 'noMinLength', message: minLengthMessage },
        { name: 'noMaxLength', message: maxLengthMessage },
      ],
      types: [
        { name: 'ngselect', component: FormlySelectComponent }
      ],
    }),
    FormlyBootstrapModule,
  ],
  declarations: [MainSettingsComponent, GroupsComponent, UsersComponent, DevicesComponent, UnitsComponent, RolesComponent, FormlySelectComponent],
  exports: [MainSettingsComponent]
})
export class SettingsModule { }
