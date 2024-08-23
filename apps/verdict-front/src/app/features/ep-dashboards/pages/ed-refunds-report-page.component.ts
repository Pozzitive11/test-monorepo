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
  selector: 'ed-refunds-report-page',
  standalone: true,
  imports: [EpPivotReportComponent],
  template: `
    <app-ep-pivot-report
      [reportName]="'Повернені кошти по зупиненим,завершеним,негативним рішення і скасуванню ВНН'"
      (loadData)="loadData()"
    />
  `
})
export class EdRefundsComponent implements OnInit {
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
        ['Причина Стоп (пов.кошт.)']: ['ВП завершено', 'ВП зупинено', 'Негативне рішення по заміні', 'Процес скасування ВНН']
      },
      selectedValues: [
        'К-ть платежів',
        'Сума платежів',
        'Кошти повернуті до негативного рішення',
        'Кошти повернуті після негативного рішення',
        'ВП завершено до повернення коштів',
        'ВП завершено після повернення коштів',
        'Повідомлення про зупинення не відправлялось',
        'ВП зупинено до відправки заяви про зупинення',
        'ВП зупинено після відправки заяви про зупинення',
        'Повернута сума на ВК',
        'Не повернута сума на ВК'
      ],
      selectedIndex: ['Причина Стоп (пов.кошт.)'],
      selectedFilterKeys: [
        'Тип ВД',
        'Приватний виконавець',
        'Компанія на яку зайшли кошти',
        'Причина Стоп (пов.кошт.)'
      ],
      selectedAggFunctions: [
        'count', 'sum', 'sum', 'sum', 'sum', 'sum', 'sum', 'sum', 'sum', 'sum', 'sum'
      ],
      selectedAliases: [
        'К-ть платежів',
        'Сума платежів',
        'Кошти повернуті до негативного рішення',
        'Кошти повернуті після негативного рішення',
        'ВП завершено до повернення коштів',
        'ВП завершено після повернення коштів',
        'Повідомлення про зупинення не відправлялось',
        'ВП зупинено до відправки заяви про зупинення',
        'ВП зупинено після відправки заяви про зупинення',
        'Повернута сума на ВК',
        'Не повернута сума на ВК'
      ]
    })
  }
}
