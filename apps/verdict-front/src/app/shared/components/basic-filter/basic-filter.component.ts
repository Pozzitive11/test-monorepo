import { Component, computed, inject, input, model, OnInit, signal } from '@angular/core'
import { BasicFilterDataModel } from '../../models/basic-filter-data.model'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { InputInGroupComponent } from '../input-in-group/input-in-group.component'
import { SwitchCheckboxComponent } from '../switch-checkbox/switch-checkbox.component'
import { NgIf } from '@angular/common'
import { TValue } from '../../models/basic-types'
import { tableValueToString } from '../../utils/transform.utils'
import { SearchableListComponent } from '../searchable-list/searchable-list.component'


@Component({
  selector: 'app-basic-filter',
  templateUrl: './basic-filter.component.html',
  styleUrls: ['./basic-filter.component.css'],
  standalone: true,
  imports: [NgIf, SwitchCheckboxComponent, InputInGroupComponent, SearchableListComponent]
})
export class BasicFilterComponent implements OnInit {
  readonly activeModal = inject(NgbActiveModal)

  readonly filterTypes = {
    empty: 'пусті значення',
    includes: 'містить',
    startsWith: 'починається на',
    endsWith: 'закінчується на',
    eq: 'дорівнює',
    le: '<=',
    ge: '>=',
    less: '<',
    greater: '>',
    in: 'входить в список'
  }

  data = model.required<BasicFilterDataModel>()
  values = input<TValue[]>([])
  stringValues = computed(() => this.values().map((v) => tableValueToString(v)))
  selectedValues = signal<string[]>([])

  selected = signal('')

  dataToSendBack = computed(() => ({
    filter: this.selected() || this.selectedValues().length ? {
      ...this.data().filter,
      in: this.selectedValues()
    } : undefined,
    sorting: this.data().sorting
  }))

  ngOnInit(): void {
    this.setSelected()
  }

  selectFilter(filterType: string, newSelectedType: number | string | undefined | boolean) {
    const filter = { ...this.data().filter }
    switch (this.selected()) {
      case this.filterTypes.empty:
        filter.empty = false
        break
      case this.filterTypes.includes:
        delete filter.includes
        break
      case this.filterTypes.startsWith:
        delete filter.startsWith
        break
      case this.filterTypes.endsWith:
        delete filter.endsWith
        break
      case this.filterTypes.eq:
        delete filter.eq
        break
      case this.filterTypes.le:
        delete filter.le
        break
      case this.filterTypes.ge:
        delete filter.ge
        break
      case this.filterTypes.less:
        delete filter.less
        break
      case this.filterTypes.greater:
        delete filter.greater
        break
    }
    this.data.update((data) => ({ ...data, filter }))
    this.selected.set(newSelectedType ? filterType : '')
  }

  selectSorting(ascending: boolean | undefined) {
    this.data.update((data) => ({ ...data, sorting: ascending }))
  }

  private setSelected() {
    const {
      empty,
      includes,
      startsWith,
      endsWith,
      eq,
      le,
      ge,
      less,
      greater
    } = this.data().filter

    if (empty)
      this.selected.set(this.filterTypes.empty)
    if (includes)
      this.selected.set(this.filterTypes.includes)
    if (startsWith)
      this.selected.set(this.filterTypes.startsWith)
    if (endsWith)
      this.selected.set(this.filterTypes.endsWith)
    if (eq)
      this.selected.set(this.filterTypes.eq)
    if (le)
      this.selected.set(this.filterTypes.le)
    if (ge)
      this.selected.set(this.filterTypes.ge)
    if (less)
      this.selected.set(this.filterTypes.less)
    if (greater)
      this.selected.set(this.filterTypes.greater)
  }

}
