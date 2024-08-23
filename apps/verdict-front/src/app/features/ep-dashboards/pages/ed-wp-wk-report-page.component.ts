import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { PivotTableService } from '../../../shared/components/pivot-table/pivot-table.service'
import {
  complexAggFunctionDescriptions,
  complexAggFunctionFactory,
  complexAggFunctionFilterFunctions
} from '../../../shared/components/pivot-table/utils/aggregation.functions'
import { UtilFunctions } from '../../../shared/utils/util.functions'
import { EdHttpService } from '../services/ed-http.service'
import { EpPivotReportComponent } from '../components/ep-pivot-report/ep-pivot-report.component'


@Component({
  selector: 'ed-wp-wk-report-page',
  standalone: true,
  imports: [EpPivotReportComponent],
  template: `
    <app-ep-pivot-report
      [reportName]="'Платежі після заміни у ВП на ВК'"
      (loadData)="loadData()"
    />
  `
})
export class EdWpWkComponent implements OnInit {
  private readonly pivotTableService = inject(PivotTableService)
  private readonly httpService = inject(EdHttpService)

  redZoneDays: number = 14

  ngOnInit(): void {
    this.pivotTableService.resetPivotTable()
  }

  loadData() {
    this.loadPreset()
    this.pivotTableService.loadData(this.httpService.loadWpData())
  }

  private loadPreset() {
    this.pivotTableService.resetAggFunctions({
      aggFunctions: { 'redZone': complexAggFunctionFactory.redZone(this.redZoneDays) },
      aggFunctionsDescriptions: { 'redZone': complexAggFunctionDescriptions.redZone },
      aggFunctionsReverse: { 'redZone': complexAggFunctionFilterFunctions.redZone(this.redZoneDays) }
    })

    this.pivotTableService.setPivotConfig({
      selectedFilters: {
        ['Компанія на яку зайшли кошти']: ['ТОВАРИСТВО З ОБМЕЖЕНОЮ ВІДПОВІДАЛЬНІСТЮ "ВЕРДИКТ КАПІТАЛ"']
      },
      selectedValues: [
        'К-ть платежів',
        'Сума платежів',
        'Сума платежів по завершеним',
        'Вічний СЛ',
        'Повернення авансів',
        'Процес скасування ВНН',
        'ВП зупинено',
        'Не повернута сума',
        'Не повернута сума більше',
        'Повернута сума',
        'Очікувана сума коштів на Дебт',
        'Повернена сума на Дебт'
      ],
      selectedIndex: ['Тип контрагента наш', 'Імя контрагента'],
      selectedFilterKeys: [
        'Тип ВД',
        'Приватний виконавець',
        'Компанія на яку зайшли кошти'
      ],
      selectedAggFunctions: [
        'count', 'sum', 'sum', 'sum', 'sum', 'sum', 'sum', 'sum', 'redZoneSum', 'sum', 'sum', 'sum'
      ],
      selectedAliases: [
        'К-ть платежів',
        'Сума платежів',
        'Сума платежів по завершеним',
        'Вічний СЛ',
        'Повернення авансів',
        'Процес скасування ВНН',
        'ВП зупинено',
        'Не повернута сума',
        `Не повернута сума більше ${UtilFunctions.daysToString(this.redZoneDays)}`,
        'Повернута сума',
        'Очікувана сума коштів на Дебт',
        'Повернена сума на Дебт'
      ]
    })
  }
}
