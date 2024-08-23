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
  selector: 'ed-payments-report-page',
  standalone: true,
  imports: [EpPivotReportComponent],
  template: `
    <app-ep-pivot-report
      [reportName]="'Платежі після заяви в суд'"
      (loadData)="loadData()"
    />
  `
})
export class EdPaymentsComponent implements OnInit {
  private readonly pivotTableService = inject(PivotTableService)
  private readonly httpService = inject(EdHttpService)

  redZoneDays: number = 14

  ngOnInit(): void {
    this.pivotTableService.resetPivotTable()
  }

  loadData() {
    this.loadPreset()
    this.pivotTableService.loadData(this.httpService.loadPaymentsData())
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
        'Негативне рішення по заміні сторони',
        'ВП зупинено',
        'Сума платежів по доп.Умовам',
        'Сума платежів для повернення',
        'Повернута сума',
        'Не повернута сума',
        'Не повернута сума більше',
        'К-ть ВП по яким замінено сторону на Дебт',
        'Очікувана сума коштів на Дебт',
        'Не повернено на Дебт більше',
        'Повернена сума на Дебт'
      ],
      selectedIndex: ['Тип контрагента наш', 'Приватний виконавець'],
      selectedFilterKeys: [
        'Тип ВД',
        'Приватний виконавець',
        'Компанія на яку зайшли кошти'
      ],
      selectedAggFunctions: [
        'count', 'sum', 'sum', 'sum', 'sum', 'sum', 'sum', 'sum', 'sum', 'sum', 'sum', 'sum', 'redZoneSum', 'sum', 'sum', 'redZoneSum', 'sum'
      ],
      selectedAliases: [
        'К-ть платежів',
        'Сума платежів',
        'Сума платежів по завершеним',
        'Вічний СЛ',
        'Повернення авансів',
        'Процес скасування ВНН',
        'Негативне рішення по заміні сторони',
        'ВП зупинено',
        'Сума платежів по доп.Умовам',
        'Сума платежів для повернення',
        'Повернута сума',
        'Не повернута сума',
        `Не повернута сума більше ${UtilFunctions.daysToString(this.redZoneDays)}`,
        'К-ть ВП по яким замінено сторону на Дебт',
        'Очікувана сума коштів на Дебт',
        `Не повернено на Дебт більше ${UtilFunctions.daysToString(this.redZoneDays)}`,
        'Повернена сума на Дебт'
      ]
    })
  }
}
