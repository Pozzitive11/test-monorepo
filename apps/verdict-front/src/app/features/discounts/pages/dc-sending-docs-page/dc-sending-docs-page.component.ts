import { Component } from '@angular/core'
import {
  DcSendingDocsTableWrapperComponent
} from '../../components/dc-sending-dosc-table-wrapper/dc-sending-docs-table-wrapper.component'

@Component({
  selector: 'dc-sending-docs-page',
  templateUrl: './dc-sending-docs-page.component.html',
  standalone: true,
  imports: [DcSendingDocsTableWrapperComponent]
})
export class DcSendingDocsPageComponent {
}
