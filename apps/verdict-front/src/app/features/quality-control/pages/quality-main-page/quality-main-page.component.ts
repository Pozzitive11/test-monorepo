import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-quality-main-page',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './quality-main-page.component.html',
  styleUrls: ['./quality-main-page.component.css']
})
export class QualityMainPageComponent {
}
