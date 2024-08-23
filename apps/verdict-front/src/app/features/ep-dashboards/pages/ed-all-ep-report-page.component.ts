import { Component, OnDestroy, OnInit } from '@angular/core'
import { EdAllEpCountInfoComponent } from '../components/ed-all-ep-count-info/ed-all-ep-count-info.component'

@Component({
  selector: 'ed-all-ep-report-page',
  standalone: true,
  imports: [EdAllEpCountInfoComponent],
  template: `
    <ed-all-ep-count-info />`
})
export class EdAllEpReportPageComponent {
}
