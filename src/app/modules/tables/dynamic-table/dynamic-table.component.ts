import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as _ from 'lodash';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss']
})
export class DynamicTableComponent implements OnInit, OnInit, OnChanges {
  @Input() columns = [];
  @Input() data = [];
  @Input() editable = false;
  @Input() delete = false;
  @Input() exportable = false;
  @Input() selection = false;
  @Input() textFilter = '';
  @Output() selectionsData = new EventEmitter();
  @Output() itemSelection = new EventEmitter();
  @Output() exportData = new EventEmitter();
  lstItemsSelected = [];
  itemsSelectedDialog = [];
  itemDataDialog = null;
  numItemsLIst = [{ label: '2', value: 2 }, { label: '4', value: 4 }, { label: '6', value: 6 }, { label: '8', value: 8 }, { label: '10', value: 10 }]
  numItems = { label: '8', value: 8 };
  p: number = 1;
  seeDialog = false;
  areGroups = false;
  areRules = false;
  areDevice = false;
  imgGrp = `${environment.imgs}/group-icon.png`
  titleDialog = '';
  filterSearch;

  constructor() { }

  ngOnInit() {
    this.generateFilter();
  }

  generateFilter() {
    const newObj = new Object();
    this.columns.map(e => newObj[e.key] = '');
    this.filterSearch = newObj;
    console.log(newObj);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data && changes.data.currentValue) {
      this.lstItemsSelected = [];
      if (this.selection) {
        this.data.map(e => e.selected = false);
      }
      this.p = 1;
    }

    if (changes.textFilter && changes.textFilter.currentValue) {
      this.p = 1;
    }
  }

  selectedAll(selected) {
    const data = selected ? this.data : [];
    this.data.map(e => e.selected = selected);
    this.selectionsData.emit({ data: data });
  }

  checkSelect(item, selected) {
    const findIndex = _.findIndex(this.data, e => e.id === item.id);
    this.data[findIndex].selected = selected
    const data = this.data.filter(e => e.selected);
    this.selectionsData.emit({ data: data });
  }

  itemSel(item, type) {
    this.itemSelection.emit({ data: item, type: type });
  }

  eventExport() {
    this.exportData.emit({});
  }

  selectedDevice(ite) {
    this.titleDialog = 'Dispositivo asociado';
    this.areRules = false;
    this.areDevice = true;
    this.areGroups = false;
    this.itemsSelectedDialog = [];
    this.itemDataDialog = ite;
    this.seeDialog = true;
  }

  selectedRules(ite) {
    this.titleDialog = 'Lista de reglas';
    this.areRules = true;
    this.areDevice = false;
    this.areGroups = false;
    this.itemsSelectedDialog = ite;
    this.seeDialog = true;
  }

  selectedGroups(ite) {
    this.titleDialog = 'Lista de grupos';
    this.areRules = false;
    this.areDevice = false;
    this.areGroups = true;
    this.itemsSelectedDialog = ite;
    this.seeDialog = true;
  }

}
