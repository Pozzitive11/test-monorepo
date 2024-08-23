import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { Observable } from 'rxjs'
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component'

type TBasis = {
  show: boolean
  count: Observable<number>
}

type TKnownWithStatus = TBasis & {
  not_our_debtor: TBasis
  our_ep: TBasis
  not_ours: TBasis
  creditors_ep: TBasis & {
    before_assignment?: TBasis & {
      not_ours: TBasis
      no_side_change: TBasis
      side_changed: TBasis
    }
    after_assignment?: TBasis
    other?: TBasis
  }
}

@Component({
  selector: 'ed-known-with-status',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './ed-known-with-status.component.html',
  styles: [`
    .nav-link {
      border: 1px solid #12abda;
      margin: 0.2rem 0;
    }
    .bg-hover-info:hover {
      background-color: #12abda !important;
    }
    .nav-pills {
      border-left: 1px dotted #12abda;
      padding-left: 1rem;
    }
  `]
})
export class EdKnownWithStatusComponent {
  @Input() knownWithStatus: TKnownWithStatus | null = null

}
