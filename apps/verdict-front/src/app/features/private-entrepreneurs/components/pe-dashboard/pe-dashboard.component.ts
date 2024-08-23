import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner'
import { tap } from 'rxjs'
import { PeDashboardService } from '../../services/pe-dashboard.service'
import {
  PePrivateEntrepreneursListComponent
} from '../../ui/pe-private-entrepreneurs-list/pe-private-entrepreneurs-list.component'

@Component({
  selector: 'pe-dashboard',
  standalone: true,
  imports: [CommonModule, NgbProgressbar, NgxSpinnerModule, PePrivateEntrepreneursListComponent],
  templateUrl: './pe-dashboard.component.html'
})
export class PeDashboardComponent implements OnInit {
  readonly spinner = inject(NgxSpinnerService)
  readonly dashboardService = inject(PeDashboardService)

  loading$ = this.dashboardService.loading$.pipe(
    tap(loading => loading ? this.spinner.show() : this.spinner.hide())
  )

  ngOnInit() {
    if (this.dashboardService.privateEntrepreneursInfo$.value.length === 0)
      this.dashboardService.loadPrivateEntrepreneursInfo()
  }

  openAll() {
    this.dashboardService.privateEntrepreneursHideInfo$.next([])
  }

  closeAll() {
    this.dashboardService.privateEntrepreneursHideInfo$
      .next(this.dashboardService.privateEntrepreneursInfo$.value.map(pe => pe.id))
  }
}
