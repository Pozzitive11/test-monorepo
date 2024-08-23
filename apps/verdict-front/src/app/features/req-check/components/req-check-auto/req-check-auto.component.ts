import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReqCheckElementsService } from '../../service/req-check-elements.service'

@Component({
  selector: 'app-req-check-auto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './req-check-auto.component.html',
  styleUrls: ['./req-check-auto.component.css']
})
export class ReqCheckAutoComponent {

  public readonly elementService = inject(ReqCheckElementsService)
}
