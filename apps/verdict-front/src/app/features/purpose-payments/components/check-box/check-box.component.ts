import { Component, inject, Input } from '@angular/core'
import { PpRowMarksService } from '../../services/pp-row-marks.service'
import { PpTableDataService } from '../../services/pp-table-data.service'

@Component({
  selector: 'app-check-box',
  templateUrl: './check-box.component.html',
  standalone: true
})
export class CheckBoxComponent {
  private rowMarks = inject(PpRowMarksService)
  private dataService = inject(PpTableDataService)

  @Input() id: string = ''

  get checked() {
    return this.rowMarks.idList.includes(this.id)
  }

  toggleCheck() {
    this.dataService.dataIsLoading$.next(true)
    if (this.checked)
      setTimeout(() => this.rowMarks.removeId(this.id))
    else
      setTimeout(() => this.rowMarks.addId(this.id))
  }

}
