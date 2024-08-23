import { Component, EventEmitter, Input, Output } from '@angular/core'
import { NgFor } from '@angular/common'
import { DefaultDropdownComponent } from '../../../../shared/components/default-dropdown/default-dropdown.component'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-pp-files-filter',
  templateUrl: './pp-files-filter.component.html',
  standalone: true,
  imports: [
    FormsModule,
    DefaultDropdownComponent,
    NgFor
  ]
})
export class PpFilesFilterComponent {
  @Input() chosen_files: string[] = []
  @Input() available_files: string[] = []
  @Input() textFilter: string = ''

  @Output() chosenFilesUpdated = new EventEmitter<string[]>()
  @Output() textFilterUpdated = new EventEmitter<string>()


  get shown_available_files(): string[] {
    return this.available_files
      .filter(value => value.toLowerCase().includes(this.textFilter.toLowerCase()))
  }

  constructor() { }

  chooseFile(file: string) {
    this.chosen_files.push(file)
    this.available_files = this.available_files
      .filter((a_file) => file !== a_file)
    this.chosenFilesUpdated.emit(this.chosen_files)
  }

  removeFile(file: string) {
    this.available_files.push(file)
    this.chosen_files = this.chosen_files
      .filter((a_file) => file !== a_file)
    this.chosenFilesUpdated.emit(this.chosen_files)
  }

  clearChosen(reverse: boolean) {
    const all_files = this.available_files.concat(this.chosen_files)
    if (reverse) {
      this.available_files = []
      this.chosen_files = all_files
    } else {
      this.chosen_files = []
      this.available_files = all_files
    }
    this.chosenFilesUpdated.emit(this.chosen_files)
  }

  updateTextFilter() {
    this.textFilterUpdated.emit(this.textFilter)
  }
}
