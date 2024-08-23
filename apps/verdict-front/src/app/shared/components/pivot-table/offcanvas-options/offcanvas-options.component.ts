import { Component, inject, input, TemplateRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PivotSelectedValuesComponent } from '../pivot-selected-values/pivot-selected-values.component'
import { NgbOffcanvas, NgbPopover } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'pivot-table-offcanvas-options',
  standalone: true,
  imports: [CommonModule, PivotSelectedValuesComponent, NgbPopover],
  templateUrl: './offcanvas-options.component.html',
  styleUrls: ['../pivot-table.component.css']
})
export class OffcanvasOptionsComponent {
  showRedZoneSlider = input<boolean>(true)

  offcanvasService = inject(NgbOffcanvas)

  openTop(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'top', panelClass: 'off-canvas-long' })
  }
}
