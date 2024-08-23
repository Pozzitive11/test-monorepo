import { Component, inject, Input } from '@angular/core'
import { NgbDateAdapter, NgbDateParserFormatter, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap'
import { DateAdapterForNgbService } from '../../../../../../shared/services/date-adapter-for-ngb.service'
import { DateFormatterForNgbService } from '../../../../../../shared/services/date-formatter-for-ngb.service'
import { DcMilitaryDocsDataService } from '../../../../services/dc-military-docs-data.service'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'dcm-docs-date-cell',
  templateUrl: './dcm-docs-date-cell.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: DateAdapterForNgbService },
    { provide: NgbDateParserFormatter, useClass: DateFormatterForNgbService }
  ],
  standalone: true,
  imports: [FormsModule, NgbInputDatepicker]
})
export class DcmDocsDateCellComponent {
  private readonly dataService = inject(DcMilitaryDocsDataService)

  @Input() col: string = ''
  @Input() rows: number[] = []
  @Input() value: string | null = null

  changeValue() {
    this.dataService.changeValue(null, this.rows, this.col, this.value)
  }
}
