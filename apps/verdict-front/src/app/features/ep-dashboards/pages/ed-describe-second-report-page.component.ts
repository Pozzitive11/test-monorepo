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
  selector: 'ed-describe-second-report-page',
  standalone: true,
  imports: [EpPivotReportComponent],
  template: `
    <app-ep-pivot-report
      [reportName]="'Черга на опис нерухомості'"
      (loadData)="loadData()"
    />
  `
})
export class EdDescribeSecondComponent implements OnInit {
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
        'Запланирована опись',
        'Сумма долга недостаточна для описи',
        'В работу нестандартников',
        'Чужая ипотека выявлена до описи',
        'Зарегистрированы несовершеннолетние',
        'Имущество на временно оккупированной территории',
        'Реализация после реализации незалогового имущества',
        'Наша ипотека',
        'Уголовный арест',
        'Постановление о приостановлении ИП',
        'Имущество в зоне БД',
        'Выписка отсутствует',
        'Необходима валидация оценки обьекта',
        'Закрытие ИП в связи с отменой решения суда',
        'Низкая цена объекта',
        'Закрытие ИП в связи с фактическим исполнением судебного решения',
        'ИД утерян при пересылке',
        'Чужая постройка на земле',
        'Имущество принято на баланс',
        'Общий итог'
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
        'Черга На опис нерухомості по написам',
        'Черга На опис нерухомості по листам'
      ],
      selectedAggFunctions: [
        'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty'
      ],
      selectedAliases: [
        'Запланирована опись',
        'Сумма долга недостаточна для описи',
        'В работу нестандартников',
        'Чужая ипотека выявлена до описи',
        'Зарегистрированы несовершеннолетние',
        'Имущество на временно оккупированной территории',
        'Реализация после реализации незалогового имущества',
        'Наша ипотека',
        'Уголовный арест',
        'Постановление о приостановлении ИП',
        'Имущество в зоне БД',
        'Выписка отсутствует',
        'Необходима валидация оценки обьекта',
        'Закрытие ИП в связи с отменой решения суда',
        'Низкая цена объекта',
        'Закрытие ИП в связи с фактическим исполнением судебного решения',
        'ИД утерян при пересылке',
        'Чужая постройка на земле',
        'Имущество принято на баланс',
        'Общий итог'
      ]
    })
  }
}
