import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-roles-table',
  templateUrl: './roles-table.component.html',
  styleUrls: ['./roles-table.component.scss']
})

export class RolesTableComponent implements OnInit {
  @Output() outPermissions = new EventEmitter();
  @Input() columns = [];
  @Input() permissions = [];
  @Input() rol = null;
  @Input() create = false;
  @Input() editable = false;
  @Input() nameRol = '';
  newNameRol = '';

  constructor() { }

  ngOnInit() {
  }

  changePermissions() {
    this.outPermissions.emit({ name: this.nameRol.trim(), permissions: this.permissions });
  }
}
