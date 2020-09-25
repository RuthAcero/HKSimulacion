import { Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'app-formly-select',
  templateUrl: './formly-select.component.html',
  styleUrls: ['./formly-select.component.scss']
})
export class FormlySelectComponent extends FieldType {
  shouldClose;
  isOpen;
  to;

  onSelectClear(evt) {
    this.isOpen = false;
    this.shouldClose = false;
  }

  onSelectBlur(evt) {
    this.isOpen = false;
    this.shouldClose = false;
  }

  onSelectClick(evt) {
 /*   if (this.shouldClose) {
      this.isOpen = false;
      this.shouldClose = false;
    } else if (!this.to.multiple) {
      this.isOpen = !this.isOpen;
      this.shouldClose = false;
    } else {
      this.isOpen = true;
      this.shouldClose = true;
    }*/
  }

  onSelectChange(evt) {
/*    if (!this.to.multiple) {
      this.isOpen = false;
      this.shouldClose = true;
    } else {
      this.shouldClose = false;
    }
    */
  }
}
