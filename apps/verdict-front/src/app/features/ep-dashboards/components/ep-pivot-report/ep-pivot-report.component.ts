import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'
import {
  OffcanvasOptionsComponent
} from '../../../../shared/components/pivot-table/offcanvas-options/offcanvas-options.component'
import { PivotTableComponent } from '../../../../shared/components/pivot-table/pivot-table.component'

@Component({
  selector: 'app-ep-pivot-report',
  standalone: true,
  imports: [
    OffcanvasOptionsComponent,
    PivotTableComponent
  ],
  templateUrl: './ep-pivot-report.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EpPivotReportComponent {
  reportName = input.required<string>()
  loadData = output()
}
