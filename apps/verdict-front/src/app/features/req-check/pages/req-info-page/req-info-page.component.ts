import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-req-info-page',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './req-info-page.component.html'
})
export class ReqInfoPageComponent {
}
