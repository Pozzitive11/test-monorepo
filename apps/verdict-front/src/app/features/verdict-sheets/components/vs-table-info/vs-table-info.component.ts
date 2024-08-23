import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core'
import { ITableInspectorInfoModel } from '../../models/table-inspector-info.model'
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { IColumnInfoModel } from '../../models/query-info.model'
import { TDbServers } from '../../models/vserdict-sheet.types'

@Component({
  selector: 'app-vs-table-info',
  standalone: true,
  imports: [
    NgbTooltip
  ],
  templateUrl: './vs-table-info.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VsTableInfoComponent {
  tableName = input.required<string>()
  tableColumns = input<ITableInspectorInfoModel[]>([])
  selectedColumns = input<IColumnInfoModel[]>([])
  db = input.required<TDbServers>()

  columnsSelected = output<IColumnInfoModel[]>()

  columns = computed(() => {
    return this.tableColumns().map((column) => {
      const selectedColumn = this.selectedColumns().find((c) => c.column_name === column.name && c.table_name === this.tableName())
      return {
        ...column,
        selected: !!selectedColumn
      }
    })
  })

  allColumnsSelected = computed((): boolean => this.columns().every((column) => column.selected))

  selectColumns(columns: ITableInspectorInfoModel[]) {
    let selectedColumnsLength = this.selectedColumns().length
    const newSelectedColumns = columns
      .map((column): IColumnInfoModel => ({
        column_name: column.name,
        alias: column.name,
        table_name: this.tableName(),
        editable: false,
        unique: column.unique,
        ordinal: selectedColumnsLength++,
        for_insert: false,
        related_key: null,
        db: this.db(),
        dictionary_id: null
      }))
      .filter((column) => !this.selectedColumns().find((c) => c.alias === column.alias))

    this.columnsSelected.emit(newSelectedColumns)
  }
}
