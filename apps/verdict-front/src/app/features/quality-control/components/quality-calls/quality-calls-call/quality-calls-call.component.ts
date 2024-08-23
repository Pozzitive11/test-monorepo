import { CommonModule, NgFor, NgIf } from '@angular/common'
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core'
import { QualityCallsCallService } from '../../../services/quality-calls-call.service'
import { ActivatedRoute } from '@angular/router'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { QualityCreateMonitoringComponent } from '../../quality-create-monitoring/quality-create-monitoring.component'
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap'
import { NgSelectModule } from '@ng-select/ng-select'
import { UserFromDB } from '../../../models/user.model'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-quality-calls-call',
  standalone: true,
  imports: [CommonModule, QualityCreateMonitoringComponent, NgbPopoverModule, NgSelectModule, FormsModule, NgIf, NgFor],
  templateUrl: './quality-calls-call.component.html',
  styles: `
    select {
      /* for Firefox */
      -moz-appearance: none;
      /* for Chrome */
      -webkit-appearance: none;
    }

    /* For IE10 */
    select::-ms-expand {
      display: none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QualityCallsCallComponent implements OnInit {
  protected qualityCallsCallService = inject(QualityCallsCallService)
  private route = inject(ActivatedRoute)
  private destroyRef = inject(DestroyRef)
  selectedOperator: UserFromDB | null
  tableHeaders = [
    { title: 'ID дзвінка', value: 'vrID' },
    { title: 'Логін', value: 'Login' },
    { title: 'Дата', value: 'StartTime' },
    { title: 'Тривалість', value: 'Duration' },
    { title: 'Номер телефону', value: 'PhoneNumber' }
  ]

  secondTableHeaders = [
    { title: 'НКС', value: 'ContractId' },
    { title: 'Тип дзвінка', value: 'CallType' },
    { title: 'Контакт з', value: 'ContactWith' },
    { title: 'Результат дзвінку', value: 'Result' },
    { title: 'Замітка', value: 'Note' }
  ]

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const id = params.get('CallId')
      if (id) {
        this.qualityCallsCallService.getSingleCall(+id)
      }
    })
    this.qualityCallsCallService.mixedFileLoader = true
  }

  selectSilencePosition() {
    this.qualityCallsCallService.getMixedRecord()
  }
}
