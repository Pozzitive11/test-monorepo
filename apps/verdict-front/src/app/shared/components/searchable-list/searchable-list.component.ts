import { Component, computed, effect, input, model, output, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { FilterListPipe } from '../../pipes/filter-list.pipe'
import { ScrollTrackerDirective } from '../../directives/scroll-tracker.directive'
import { ScrollOnHoverDirective } from '../../directives/scroll-on-hover.directive'
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { ShortTextPipe } from '../../pipes/short-text.pipe'
import { LoadingBarComponent } from '../loading-bar/loading-bar.component'

@Component({
  selector: 'app-searchable-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ScrollTrackerDirective,
    ScrollOnHoverDirective,
    NgbProgressbar,
    FilterListPipe,
    ShortTextPipe,
    LoadingBarComponent
  ],
  templateUrl: './searchable-list.component.html',
  styleUrls: ['./searchable-list.component.css']
})
export class SearchableListComponent<T extends string> {
  readonly loadMoreStep = 10

  list = input<T[], T[]>([], { transform: (list: T[]) => [...new Set(list)] })
  searchText = model<string>('')
  selectedValues = model<T[]>([])
  multiple = input<boolean>(true)
  sortValues = input<boolean>(true)
  maxSymbols = input<number>(60)

  valueSelected = output<T>()

  loading = signal(false)
  filteredList = computed<T[]>(() => {
    let list = [...this.list()]
    if (this.sortValues()) list.sort((a, b) => a.localeCompare(b))

    return list.filter(item => String(item).toLowerCase().includes(this.searchText().toLowerCase()))
  })
  shownIndexRange = signal<[number, number]>([0, this.loadMoreStep])
  selecting = signal<boolean>(false)
  clickedItemIndex = signal<number>(-1)
  hoveredItemIndex = signal<number>(-1)
  selectingMode = signal<'add' | 'remove'>('add')
  allIsSelected = computed(() => this.selectedValues().length === this.list().length)

  constructor() {
    effect(() => {
      if (this.selectedValues().some(value => !this.list().includes(value))) {
        this.selectedValues.update((values) => values.filter(value => this.list().includes(value)))
      }
    }, { allowSignalWrites: true })
  }

  onItemSelect() {
    if (this.clickedItemIndex() === -1 || this.hoveredItemIndex() === -1) return

    const [start, end] = [this.clickedItemIndex(), this.hoveredItemIndex()].sort((a, b) => a - b)
    const selectedItems = this.filteredList()
      .slice(start, end + 1)
      .filter(item => {
        if (this.selectingMode() === 'add')
          return this.selectedValues().indexOf(item) === -1
        else
          return this.selectedValues().indexOf(item) !== -1
      })

    if (this.selectingMode() === 'add')
      this.selectedValues.update((values) => [...values, ...selectedItems])
    else
      this.selectedValues.update((values) => values.filter(item => selectedItems.indexOf(item) === -1))

    this.clickedItemIndex.set(-1)
    this.hoveredItemIndex.set(-1)
  }

  onShowMore() {
    if (this.list().length > this.shownIndexRange()[1])
      this.shownIndexRange.update(([start, end]) => [start, end + this.loadMoreStep])
  }

  itemInSelectedRange(index: number) {
    if (this.clickedItemIndex() === -1 || this.hoveredItemIndex() === -1) return false
    const [start, end] = [this.clickedItemIndex(), this.hoveredItemIndex()].sort((a, b) => a - b)
    return index >= start && index <= end
  }

  toggleAll() {
    this.loading.set(true)

    setTimeout(() => {
      if (this.selectedValues().length === this.list().length || this.filteredList().every(item => this.selectedValues().includes(item)))
        this.selectedValues.update((values) => values.filter(item => !this.filteredList().includes(item)))
      else if (this.selectedValues.length === 0)
        this.selectedValues.set([...this.filteredList()])
      else
        this.selectedValues.update((values) => [...values, ...this.filteredList().filter(item => !values.includes(item))])

      this.loading.set(false)
    }, 0)
  }

  startSelecting(index: number, listItem: T) {
    if (!this.multiple()) {
      this.selectedValues.set([listItem])
      this.valueSelected.emit(listItem)
      return
    }

    this.selecting.set(true)
    this.selectingMode.set(this.selectedValues().includes(listItem) ? 'remove' : 'add')
    this.clickedItemIndex.set(index)
    this.hoveredItemIndex.set(index)
  }
}
