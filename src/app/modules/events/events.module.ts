import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './components/events/events.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [EventsComponent],
  exports: [EventsComponent]
})
export class EventsModule { }
