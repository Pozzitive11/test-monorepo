import { ChangeDetectionStrategy, Component } from '@angular/core'
import { QualityCallsTableComponent } from '../../components/quality-calls/quality-calls-table/quality-calls-table.component'
import { QualityCallsSearchParamsComponent } from '../../components/quality-calls/quality-calls-search-params/quality-calls-search-params.component'
import { QualityCallsSearchByCallIdComponent } from '../../components/quality-calls/quality-calls-search-by-call-id/quality-calls-search-by-call-id.component'

@Component({
  selector: 'app-quality-calls-page',
  standalone: true,
  imports: [QualityCallsTableComponent, QualityCallsSearchParamsComponent, QualityCallsSearchByCallIdComponent],
  templateUrl: './quality-calls-page.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QualityCallsPageComponent {}
