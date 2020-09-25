import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaIconsModule } from '../fa-icons/fa-icons.module';
import { ToolsModule } from '../tools/tools.module';
import { NgBootstrpMModule } from '../ng-bootstrp-m/ng-bootstrp-m.module';
import { DynamicTableComponent } from './dynamic-table/dynamic-table.component';
import { RolesTableComponent } from './roles-table/roles-table.component';
import { SearchPipeTable } from 'src/app/filterTable.pipe';
import { ResultListComponent } from './result-list/result-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FaIconsModule,
    ToolsModule,
    NgBootstrpMModule
  ],
  declarations: [DynamicTableComponent, RolesTableComponent, SearchPipeTable, ResultListComponent],
  exports: [DynamicTableComponent, RolesTableComponent, ResultListComponent]
})
export class TablesModule { }
