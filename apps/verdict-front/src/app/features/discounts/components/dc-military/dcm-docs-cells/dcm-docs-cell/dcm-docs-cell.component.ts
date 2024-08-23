import { Component, inject, Input } from '@angular/core'
import { DcMilitaryDocsDataService } from '../../../../services/dc-military-docs-data.service'
import { FormsModule } from '@angular/forms'
import { NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'dcm-docs-cell',
  templateUrl: './dcm-docs-cell.component.html',
  standalone: true,
  imports: [NgIf, FormsModule, NgFor]
})
export class DcmDocsCellComponent {
  private readonly dataService = inject(DcMilitaryDocsDataService)

  @Input() col: string = ''
  @Input() inn: string = ''
  @Input() rows: number[] = []
  @Input() value: any
  @Input() isEditable: boolean = false
  @Input() dropdown: string[] = []

  get isDefault() { return !this.isEditable && !this.dropdown.length && this.col !== 'Коментар' }

  changeValue() {
    this.dataService.changeValue(null, this.rows, this.col, this.value)
  }

  toggleShow(dropMenu: HTMLUListElement) {
    !dropMenu.classList.contains('show') ? dropMenu.classList.add('show') : dropMenu.classList.remove('show')
  }

  hideDropdown(dropMenu: HTMLUListElement) {
    dropMenu.classList.remove('show')
  }
}



