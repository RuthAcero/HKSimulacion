import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {
  itemMenuSelected = null;

  constructor() { }

  ngOnInit() {
  }

  changeItem(data) {
    this.itemMenuSelected = data.num;
  }
}
