import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faList } from '@fortawesome/free-solid-svg-icons/faList';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faBan } from '@fortawesome/free-solid-svg-icons/faBan';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faPenAlt } from '@fortawesome/free-solid-svg-icons/faPenAlt';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons/faLocationArrow';
import { faMapMarked } from '@fortawesome/free-solid-svg-icons/faMapMarked';
import { faDrawPolygon } from '@fortawesome/free-solid-svg-icons/faDrawPolygon';
import { faTruck } from '@fortawesome/free-solid-svg-icons/faTruck';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';

library.add(faList, faExclamationTriangle, faCog, faHome, faBan, faCheck, faSearch, faTimesCircle, faUser, faPenAlt,
  faTrashAlt, faLocationArrow, faMapMarked, faDrawPolygon, faTruck, faInfoCircle);

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  declarations: [],
  exports: [FontAwesomeModule]
})
export class FaIconsModule { }
