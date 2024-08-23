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
  selector: 'ed-describe-fourth-report-page',
  standalone: true,
  imports: [EpPivotReportComponent],
  template: `
    <app-ep-pivot-report
      [reportName]="'Черга на опис з обрізкою по сумі'"
      (loadData)="loadData()"
    />
  `
})
export class EdDescribeFourthComponent implements OnInit {
  private readonly pivotTableService = inject(PivotTableService)
  private readonly httpService = inject(EdHttpService)

  redZoneDays: number = 14

  ngOnInit(): void {
    this.pivotTableService.resetPivotTable()
  }

  loadData() {
    this.loadPreset()
    this.pivotTableService.loadData(this.httpService.loadFirstData())
  }

  private loadPreset() {
    this.pivotTableService.resetAggFunctions({
      aggFunctions: { 'redZone': complexAggFunctionFactory.redZone(this.redZoneDays) },
      aggFunctionsDescriptions: { 'redZone': complexAggFunctionDescriptions.redZone },
      aggFunctionsReverse: { 'redZone': complexAggFunctionFilterFunctions.redZone(this.redZoneDays) }
    })

    this.pivotTableService.setPivotConfig({
      selectedValues: [
        'К-ть майна',
        'Сума оцінки, грн.',
        'Сума листів по оціненим об\'єктам, грн.',
        'Очікувана сума, грн.',
        'Очікувана сума, грн.'
      ],
      selectedIndex: ['Тип майна', 'Підтип майна'],
      selectedFilterKeys: [
        'Актуальний реєстр',
        'Актуальний ПВ',
        'Тип ВД',
        'Приватний виконавець',
        'Стягувач',
        'Стан ВП',
        'Група колекшн',
        'СЛ Категория',
        'Статус по опрацюванню',
        'Опрацьовано',
        'Тип майна'
      ],
      selectedButtonFiltersKeys: [
        'Черга на опис нерухомості по написам',
        'Черга на опис нерухомості по листам'
      ],
      selectedAggFunctions: [
        'count',
        'sum', 'sum', 'sum', 'avg'
      ],
      selectedAliases: [
        'К-ть майна',
        'Сума оцінки, грн.',
        'Сума листів по оціненим об\'єктам, грн.',
        'Очікувана сума, грн.',
        'Середня сума на об\'єкт, грн.'
      ]
    })
  }
}
