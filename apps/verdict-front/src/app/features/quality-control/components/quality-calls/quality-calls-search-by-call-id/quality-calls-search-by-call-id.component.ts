import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NavigationExtras, Router } from '@angular/router'

@Component({
  selector: 'app-quality-calls-search-by-call-id',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './quality-calls-search-by-call-id.component.html',
  styles: `
    input[type='number']::-webkit-outer-spin-button,
    input[type='number']::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    input[type='number'] {
      -moz-appearance: textfield;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QualityCallsSearchByCallIdComponent {
  private readonly router = inject(Router)

  callId = ''
  navigateToCallPage() {
    const queryParams: NavigationExtras = {
      queryParams: {
        CallId: this.callId
      }
    }

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/quality-control/quality-calls-call'], queryParams)
    )
    window.open(url, '_blank')
  }
}
