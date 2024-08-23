import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterOutlet } from '@angular/router'
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap'
import { NksErrorsBlockComponent } from '../../components/nks-errors-block/nks-errors-block.component'

@Component({
  selector: 'nks-errors-main-page',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgbAccordionModule, NksErrorsBlockComponent],
  templateUrl: './nks-errors-main-page.component.html',
  styleUrls: ['./nks-errors-main-page.component.css']
})
export class NksErrorsMainPageComponent {
  clientsCount = 0
}
