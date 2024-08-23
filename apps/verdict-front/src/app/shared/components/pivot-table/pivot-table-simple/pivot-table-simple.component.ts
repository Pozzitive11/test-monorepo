import { CommonModule } from '@angular/common'
import {
  Component,
  computed,
  effect,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges
} from '@angular/core'
import { DisplayTableComponent } from '../display-table/display-table.component'
import { PivotTableModel } from '../models/pivot-table.model'
import { addRowPercentages } from '../utils/add-row-percentages.function'
import { filterRowsForHigherLevel } from '../utils/filter-rows-for-higher-level.function'
import { getHigherLevelNames } from '../utils/get-higher-level-names.function'
import { interfaceDataToObjectsFunction } from '../utils/interface-data-to-objects.function'
import { pivotTableFunction } from '../utils/pivot-table.function'
import { sortPivotTable } from '../utils/sort-pivot-table.function'
import { TTable, TValue } from '../../../models/basic-types'

@Component({
  selector: 'pivot-table-simple',
  standalone: true,
  imports: [CommonModule, DisplayTableComponent],
  templateUrl: './pivot-table-simple.component.html',
  styleUrls: ['./pivot-table-simple.component.css']
})
export class PivotTableSimpleComponent implements OnChanges {
  @Input() data: any[] = []
  @Input() index: string[] = []
  @Input() rowAliases: string[] = []
  @Input() resultAliases: string[] = []
  @Input() values: string[] = []
  @Input() aggFunctions: ((val: TValue[]) => TValue)[] = []
  // [numerator, denominator, columnName]
  @Input() rowPercentagesKeys: [string, string, string][] = []
  @Input() title: string = ''
  @Input() sep: string = '|'
  @Input() totalRowName: string = 'Всього'

  @Output() basicTableViewSelected = new EventEmitter<{ rowName: string; col: string | null }>()
  dataForPivot = signal<TTable>([])
  pivotData = computed<{ tableLevels: number, firstRowName: string, sortedFinalTable: PivotTableModel }>(() => {
    if (this.dataForPivot().length === 0) return {
      tableLevels: 0,
      firstRowName: '',
      sortedFinalTable: {}
    }
    return pivotTableFunction(
      this.index,
      this.values,
      this.aggFunctions,
      this.resultAliases,
      this.dataForPivot(),
      this.sep,
      '--',
      this.totalRowName
    )
  })
  sorting = signal<{ [col: string]: boolean | undefined }>({})
  hiddenLevels = signal<string[]>([])
  displayedTable = computed(() => {
    return sortPivotTable(
      addRowPercentages(this.pivotData().sortedFinalTable, this.rowPercentagesKeys),
      this.sorting(),
      this.totalRowName
    )
  })
  tableIndex = computed<string[]>(() => Object.keys(this.displayedTable()))
  tableColumns = computed<string[]>(() => {
    const table = this.displayedTable()
    return Object.keys(table[Object.keys(table)[0]])
  })
  tableHigherLevels = computed(() => {
    return this.tableIndex()
      .filter((key) => key.split(this.sep).length === 1 && key !== this.totalRowName)
      .concat([this.totalRowName])
  })
  tableRowNames = computed(() => {
    return filterRowsForHigherLevel(
      getHigherLevelNames(this.tableIndex(), this.sep, this.pivotData().tableLevels),
      this.hiddenLevels(),
      this.sep
    )
  })

  constructor() {
    effect(() => {
      if (this.pivotData().tableLevels > 2 && this.hiddenLevels().length === 0)
        this.hiddenLevels.set(this.tableIndex().filter((name) => name !== this.totalRowName))
      else if (this.pivotData().tableLevels > 2)
        this.hiddenLevels.set([])
    }, { allowSignalWrites: true })
  }

  get percentColumns(): string[] {
    return this.rowPercentagesKeys.map(([_1, _2, columnName]) => columnName)
  }

  ngOnChanges(changes: SimpleChanges): void {
    interfaceDataToObjectsFunction(this.data, this.rowAliases).then(
      (data) => this.dataForPivot.set(data)
    )
  }
}
