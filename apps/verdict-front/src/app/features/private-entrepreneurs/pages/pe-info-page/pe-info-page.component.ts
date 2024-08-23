import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'pe-info-page',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './pe-info-page.component.html'
})
export class PeInfoPageComponent {
}
