import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap'
interface Alert {
  type: string
  message: string
}
@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [NgbAlertModule],
  templateUrl: './alert.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertComponent {
  @Input() message: string
  @Input() type: string
  alerts: Alert[]

  close() {
    this.alerts.splice(0, 1)
  }
}
