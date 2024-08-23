import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReqCheckElementsService } from '../../service/req-check-elements.service'

@Component({
  selector: 'app-req-check-military',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './req-check-military.component.html',
  styleUrls: ['./req-check-military.component.css']
})
export class ReqCheckMilitaryComponent {
  public readonly elementService = inject(ReqCheckElementsService)

}
