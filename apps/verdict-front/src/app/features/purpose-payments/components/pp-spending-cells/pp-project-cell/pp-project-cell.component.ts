import { Component, EventEmitter, inject, Input, Output } from '@angular/core'
import { PpSpendingCellsService } from '../../../services/pp-spending-cells.service'
import { DictionaryFullModel } from '../../../../../shared/models/dictionary-full.model'
import { combineLatest, filter, map, Observable, tap } from 'rxjs'
import { ShortTextPipe } from '../../../../../shared/pipes/short-text.pipe'
import { AsyncPipe, NgFor } from '@angular/common'
import {
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbTooltip
} from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'pp-project-cell',
  templateUrl: './pp-project-cell.component.html',
  standalone: true,
  imports: [
    NgbDropdown,
    NgbDropdownToggle,
    NgbTooltip,
    NgbDropdownMenu,
    NgFor,
    NgbDropdownItem,
    AsyncPipe,
    ShortTextPipe
  ]
})
export class PpProjectCellComponent {
  readonly spendingCellsService = inject(PpSpendingCellsService)

  @Input() row: string = '_'
  @Input() value?: DictionaryFullModel

  @Output() valueChange = new EventEmitter<DictionaryFullModel>()

  projectList$: Observable<DictionaryFullModel[]> = combineLatest([
    this.spendingCellsService.businessSelected$,
    this.spendingCellsService.projects$
  ]).pipe(
    filter(([businessSelected, _]) => businessSelected.row === this.row),
    map(([businessSelected, projects]) => {
      return projects.filter(project => project.Description === businessSelected.value?.id.toString())
    }),
    tap(projects => {
      if (projects.map(project => project.Name).indexOf(<string>this.value?.Name) === -1)
        this.changeValue(projects.length === 1 ? projects[0] : undefined)
    })
  )

  changeValue(project?: DictionaryFullModel) {
    if (this.value === project) return

    this.value = project
    this.valueChange.emit(this.value)
  }
}
