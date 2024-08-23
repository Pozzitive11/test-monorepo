import { Component, Input } from '@angular/core'
import { CCMailsTableModel } from '../../../models/report-models'
import { ProjectRnumberTable } from '../../../abstract-classes/project-rnumber.class'
import { DecimalPipe, NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'app-default-mails-table',
  templateUrl: './default-mails-table.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    DecimalPipe
  ]
})
export class DefaultMailsTableComponent extends ProjectRnumberTable {
  @Input() override reportData?: CCMailsTableModel

  constructor() { super() }

}
