import { Component, EventEmitter, Input, Output } from '@angular/core'
import { NgFor } from '@angular/common'

@Component({
  selector: 'dc-paths-of-doc-sending',
  templateUrl: './dc-paths-of-doc-sending.component.html',
  standalone: true,
  imports: [NgFor]
})
export class DcPathsOfDocSendingComponent {
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
