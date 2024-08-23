import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { PivotTableService } from '../../../shared/components/pivot-table/pivot-table.service'
import {
  complexAggFunctionDescriptions,
  complexAggFunctionFactory,
  complexAggFunctionFilterFunctions
} from '../../../shared/components/pivot-table/utils/aggregation.functions'
import { EdHttpService } from '../services/ed-http.service'
import { EpPivotReportComponent } from '../components/ep-pivot-report/ep-pivot-report.component'


@Component({
  selector: 'ed-avans-report-page',
  standalone: true,
  imports: [EpPivotReportComponent],
  template: `
    <app-ep-pivot-report
      [reportName]="'Звіт по поверненню авансових платежів'"
      (loadData)="loadData()"
    />
  `
})
export class EdAvansComponent implements OnInit {
  private readonly pivotTableService = inject(PivotTableService)
  private readonly httpService = inject(EdHttpService)

  redZoneDays: number = 14

  ngOnInit(): void {
    this.pivotTableService.resetPivotTable()
  }

  loadData() {
    this.loadPreset()
    this.pivotTableService.loadData(this.httpService.loadAvansData())
  }

  private loadPreset() {
    this.pivotTableService.resetAggFunctions({
      aggFunctions: { 'redZone': complexAggFunctionFactory.redZone(this.redZoneDays) },
      aggFunctionsDescriptions: { 'redZone': complexAggFunctionDescriptions.redZone },
      aggFunctionsReverse: { 'redZone': complexAggFunctionFilterFunctions.redZone(this.redZoneDays) }
    })

    this.pivotTableService.setPivotConfig({
      selectedValues: [
        'К-ть сплачених авансів',
        'Сума авансового',
        'К-ть повернених авансів',
        'Сума повернених авансів',
        'Немає підстав для повернення авансового',
        'К-ть не повернених авансів',
        'Сума не повернених авансів',
        'Був ДС',
        'Боржник помер',
        'Процес скасування ВНН',
        'К-ть не повернутих авансів з врахуванням ДС і скасованого ВНН',
        'Сума не повернутих авансів з врахуванням ДС і скасованого ВНН',
        'Є платежі',
        'Завершені'
      ],
      selectedIndex: ['Тип авансування', 'Куратор', 'Імя контрагента'],
      selectedFilterKeys: [
        'Тип авансування',
        'Тип ВД',
        'Стягувач'
      ],
      selectedButtonFiltersKeys: [],
      selectedAggFunctions: [
        'count', 'sum', 'sum', 'sum', 'sum', 'sum', 'sum', 'sum', 'sum', 'sum', 'sum', 'sum', 'sum', 'sum'
      ],
      selectedAliases: [
        'К-ть сплачених авансів',
        'Сума авансового',
        'К-ть повернених авансів',
        'Сума повернених авансів',
        'Немає підстав для повернення авансового',
        'К-ть не повернених авансів',
        'Сума не повернених авансів',
        'Був ДС',
        'Боржник помер',
        'Процес скасування ВНН',
        'К-ть не повернутих авансів з врахуванням ДС і скасованого ВНН',
        'Сума не повернутих авансів з врахуванням ДС і скасованого ВНН',
        'Є платежі',
        'Завершені'
      ]
    })
  }
}
