import { Component, EventEmitter, inject, Input, Output } from '@angular/core'
import { NgbActiveModal, NgbDate } from '@ng-bootstrap/ng-bootstrap'
import { SearchableListComponent } from '../../../../../shared/components/searchable-list/searchable-list.component'
import {
  DatePickerRangePopupComponent
} from '../../../../../shared/components/date-picker-range-popup/date-picker-range-popup.component'

@Component({
  selector: 'dct-journal-modal',
  templateUrl: './dct-journal-modal.component.html',
  standalone: true,
  imports: [DatePickerRangePopupComponent, SearchableListComponent]
})
export class DctJournalModalComponent {
  readonly activeModal = inject(NgbActiveModal)

  @Input() refNumberCompanies: string[] = []
  @Input() journalDatesRange: { MinDate: NgbDate | null, MaxDate: NgbDate | null } = { MinDate: null, MaxDate: null }
  @Input() journalDateFilter: { fromDate: NgbDate | null, toDate: NgbDate | null } = { fromDate: null, toDate: null }

  @Output() addManualRefNumber = new EventEmitter()

  selectedRefNumberCompanies: string[] = []

}
