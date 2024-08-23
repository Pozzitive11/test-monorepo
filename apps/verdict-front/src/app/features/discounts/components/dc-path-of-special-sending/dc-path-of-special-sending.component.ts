import { Component, EventEmitter, Input, Output } from '@angular/core'
import { NgFor } from '@angular/common'

@Component({
  selector: 'dc-path-of-special-sending',
  templateUrl: './dc-path-of-special-sending.component.html',
  standalone: true,
  imports: [NgFor]
})
export class DcPathOfSpecialSendingComponent {
  @Input() pathsOfSending!: { name: string, selected: boolean }[]

  @Output() pathsChosen = new EventEmitter<string>()

  changePaths() {
    this.pathsChosen.emit(
      this.pathsOfSending
        .filter(value => value.selected)
        .map(value => value.name)
        .join(', ')
    )
  }
}
