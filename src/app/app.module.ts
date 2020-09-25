import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ContainerComponent } from './components/container/container.component';
import { HeaderComponent } from './components/header/header.component';
import { ToolsModule } from './modules/tools/tools.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FaIconsModule } from './modules/fa-icons/fa-icons.module';
import { SettingsModule } from './modules/settings/settings.module';
import { EventsModule } from './modules/events/events.module';
import { MonitoringModule } from './modules/monitoring/monitoring.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgBootstrpMModule } from './modules/ng-bootstrp-m/ng-bootstrp-m.module';
import { InterceptorService } from './Interceptors/interceptor.service';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

export function requiredMessage(error, field) {
  return `Campo requerido`;
}

export function isNotEmptyMessage(error, field) {
  return `Campo requerido, datos no válidos`;
}

export function isNotEmpty(control) {
  const texto = control.value.replace(/^\s+|\s+$|\s+(?=\s)/g, "")
  texto.trim();
  return texto != '' ? null : { 'noEmpty': true };
}

@NgModule({
  declarations: [
    AppComponent,
    ContainerComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToolsModule,
    FaIconsModule,
    NgBootstrpMModule,
    MonitoringModule,
    SettingsModule,
    EventsModule,
    FormlyModule.forRoot({
      validators: [
        { name: 'noEmpty', validation: isNotEmpty }
      ],
      validationMessages: [
        { name: 'required', message: requiredMessage },
        { name: 'noEmpty', message: isNotEmptyMessage }
      ],
    }),
    FormlyBootstrapModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
