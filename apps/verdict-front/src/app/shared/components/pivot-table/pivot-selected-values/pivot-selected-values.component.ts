import { Component, computed, inject, input, output, Signal, TemplateRef, WritableSignal } from '@angular/core'
import { CommonModule } from '@angular/common'

import { PivotTableService } from '../pivot-table.service'
import { CdkDragDrop, copyArrayItem, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { SearchableListComponent } from '../../searchable-list/searchable-list.component'
import { CdkMenuModule } from '@angular/cdk/menu'
import { openFilterModal } from '../pivot-filters/open-filter.function'
import {
  complexAggFunctionDescriptions,
  complexAggFunctionFactory,
  complexAggFunctionFilterFunctions
} from '../utils/aggregation.functions'
import { FormsModule } from '@angular/forms'
import { InputInGroupComponent } from '../../input-in-group/input-in-group.component'
import { MessageHandlingService } from '../../../services/message-handling.service'

@Component({
  selector: 'pivot-selected-values',
  standalone: true,
  imports: [CommonModule, DragDropModule, SearchableListComponent, CdkMenuModule, FormsModule, InputInGroupComponent],
  templateUrl: './pivot-selected-values.component.html',
  styleUrls: ['../pivot-table.component.css']
})
export class PivotSelectedValuesComponent {
  private readonly pivotTableService = inject(PivotTableService)
  private readonly modalService = inject(NgbModal)
  private readonly messageService = inject(MessageHandlingService)

  showRedZoneSlider = input<boolean>(true)
  closeCanvas = output<void>()

  aliasNameInEdit: string = ''
  currentContextElement?: string
  checkedColumns: string[] = []
  rangeValue: number = 14

  get selectedValues() {
    return this.pivotTableService.selectedValues
  }

  get selectedIndex() {
    return this.pivotTableService.selectedIndex
  }

  get selectedFilters() {
    return this.pivotTableService.selectedFilterKeys
  }

  get selectedAggFunctions() {
    return this.pivotTableService.selectedAggFunctions
  }

  get selectedAliases() {
    return this.pivotTableService.selectedAliases
  }

  get selectedTabs() {
    return this.pivotTableService.selectedTabs
  }

  tableColumns = computed(() => this.pivotTableService.data().length ? Object.keys(this.pivotTableService.data()[0]) : [])

  aggFunctions = computed(() => Object.keys(this.pivotTableService.aggFunctions()))
  aggFunctionsDescriptions = computed(() => this.aggFunctions().map((funcKey) => this.aggFunctionsDescriptionsMap(funcKey)))

  aggFunctionsDescriptionsMap(funcKey: string) {
    if (!this.pivotTableService.aggFunctionsDescriptions()[funcKey]) {
      this.messageService.sendError(`Не знайдено опис функції агрегації ${funcKey}`)
    }
    return this.pivotTableService.aggFunctionsDescriptions()[funcKey]
  }

  drop($event: CdkDragDrop<string[]>, currentList: WritableSignal<string[]>) {
    if ($event.previousContainer.id !== $event.container.id) {
      if ($event.previousContainer.id === 'columns' && $event.container.id === 'selectAggFunction')
        return
      if ($event.previousContainer.id === 'functions' && $event.container.id !== 'selectAggFunction')
        return

      if (['columns', 'functions', 'selectFilters'].includes($event.previousContainer.id)) {
        if ($event.container.id === 'selectValue') {
          this.addValue($event.previousContainer.data[$event.previousIndex], $event.currentIndex)
        } else {
          copyArrayItem(
            $event.previousContainer.data,
            $event.container.data,
            $event.previousIndex,
            $event.currentIndex
          )
        }
      } else {
        if ($event.container.id === 'selectValue') {
          this.addValue($event.previousContainer.data[$event.previousIndex], $event.currentIndex)
          $event.previousContainer.data.splice($event.previousIndex, 1)
        } else {
          transferArrayItem(
            $event.previousContainer.data,
            $event.container.data,
            $event.previousIndex,
            $event.currentIndex
          )
        }
      }
    } else {
      if ($event.previousIndex !== $event.currentIndex) {
        if ($event.container.id === 'selectValue') {
          [
            this.selectedValues,
            this.selectedAggFunctions,
            this.selectedAliases
          ].forEach((signalList) => {
            signalList.update((list) => {
              moveItemInArray(list, $event.previousIndex, $event.currentIndex)
              return [...list]
            })
          })
        } else
          currentList.update((list) => {
            moveItemInArray(list, $event.previousIndex, $event.currentIndex)
            return [...list]
          })
      }
    }
  }


  removeElement(elementIndex: number, currentList: WritableSignal<string[]>, isSelectedValues: boolean = false) {
    currentList.update((list) => {
      list.splice(elementIndex, 1)
      if (isSelectedValues) {
        [this.selectedAliases, this.selectedAggFunctions].forEach((signalList) => {
          signalList.update((list) => {
            list.splice(elementIndex, 1)
            return [...list]
          })
        })
      }
      return [...list]
    })
  }

  updatePivot() {
    this.pivotTableService.loading.set(true)
    this.closeCanvas.emit()
    setTimeout(() => this.pivotTableService.createPivotTable(), 0)
  }

  openFilter(column: string) {
    this.pivotTableService.openFilter(column, false)
  }

  clearFilter(column: string) {
    this.pivotTableService.selectedFilters.update((selectedFilters) => {
      delete selectedFilters[column]
      return { ...selectedFilters }
    })
  }

  filterIsApplied(column: string) {
    return !!this.pivotTableService.selectedFilters()[column]
  }

  editAlias(index: number, alias: string, aliasEdit: TemplateRef<any>) {
    this.aliasNameInEdit = alias
    this.modalService.open(aliasEdit, { centered: true, scrollable: true, size: '500px' }).result.then(
      () => {
        if (!this.aliasNameInEdit)
          return

        this.pivotTableService.selectedAliases.update((selectedAliases) => {
          selectedAliases[index] = this.aliasNameInEdit
          return [...selectedAliases]
        })
        this.aliasNameInEdit = ''
      },
      () => this.aliasNameInEdit = ''
    )
  }

  replaceFunction(index: number, functionEdit: TemplateRef<any>) {
    this.modalService.open(functionEdit, { centered: true, scrollable: true, size: '500px' }).result.then(
      (selectedFunc: string) => {
        if (!selectedFunc)
          return

        const functionIndex = this.aggFunctionsDescriptions().indexOf(selectedFunc)

        this.pivotTableService.selectedAggFunctions.update((selectedAggFunctions) => {
          selectedAggFunctions[index] = this.aggFunctions()[functionIndex]
          return [...selectedAggFunctions]
        })
      },
      () => {}
    )
  }

  toggleColumnCheck(column: string) {
    if (this.checkedColumns.includes(column))
      this.checkedColumns.splice(this.checkedColumns.indexOf(column), 1)
    else
      this.checkedColumns.push(column)
  }

  addCheckedTo(where: 'filter' | 'index' | 'value' | 'tabs') {
    if (!this.checkedColumns.length && this.currentContextElement)
      this.checkedColumns = [this.currentContextElement]
    switch (where) {
      case 'filter':
        this.selectedFilters.update((selectedFilters) => selectedFilters.concat(this.checkedColumns))
        break
      case 'index':
        this.selectedIndex.update((selectedIndex) => selectedIndex.concat(this.checkedColumns))
        break
      case 'value':
        this.selectedValues.update((selectedValues) => selectedValues.concat(this.checkedColumns))
        this.selectedAggFunctions.update((selectedAggFunctions) => selectedAggFunctions.concat(
          this.checkedColumns.map(column => this.functionForValue(column))
        ))
        this.selectedAliases.update((selectedAliases) => selectedAliases.concat(
          this.checkedColumns.map(column => `${column} (${this.aggFunctionsDescriptionsMap(this.functionForValue(column))})`)
        ))
        break
      case 'tabs':
        this.selectedTabs.update((selectedTabs) => selectedTabs.concat(this.checkedColumns))
        break
    }
    this.checkedColumns = []
  }

  rangeChange(event: any) {
    // TODO: FIX THIS !!!
    this.pivotTableService.resetAggFunctions({
      aggFunctions: { 'redZone': complexAggFunctionFactory.redZone(event.target.value) },
      aggFunctionsDescriptions: { 'redZone': complexAggFunctionDescriptions.redZone },
      aggFunctionsReverse: { 'redZone': complexAggFunctionFilterFunctions.redZone(event.target.value) }
    })

    this.pivotTableService.selectedAliases.update((selectedAliases) => {
      return selectedAliases.map((v) => {
        if (v.includes('більше')) {
          return v.replace(/\d+/, event.target.value)
        } else {
          return v
        }
      })
    })
  }

  private functionForValue(column: string) {
    const columnType = this.pivotTableService.getColumnType(column)
    if (columnType === 'number')
      return 'sum'
    else if (columnType === 'Date')
      return 'max'
    else
      return 'countNotEmpty'
  }

  private addValue(column: string, index: number) {
    const funcName = this.functionForValue(column)
    this.selectedValues.update((selectedValues) => {
      selectedValues.splice(index, 0, column)
      return [...selectedValues]
    })
    this.selectedAggFunctions.update((selectedAggFunctions) => {
      selectedAggFunctions.splice(index, 0, funcName)
      return [...selectedAggFunctions]
    })
    this.selectedAliases.update((selectedAliases) => {
      selectedAliases.splice(index, 0, `${column} (${this.aggFunctionsDescriptionsMap(funcName)})`)
      return [...selectedAliases]
    })
  }
}

