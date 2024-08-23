import { Component, inject, Input, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterOutlet } from '@angular/router'
import { NksErrorsHttpService } from '../../services/nks-errors-http.service'
import { NgbAccordionModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'nks-errors-block',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgbAccordionModule, NgbPopoverModule],
  templateUrl: './nks-errors-block.component.html',
  styleUrls: ['./nks-errors-block.component.css']
})
export class NksErrorsBlockComponent implements OnInit {
  private readonly nksErrorsHttpService = inject(NksErrorsHttpService)

  @Input() blockName = ''

  nonBannedClients: { [key: string]: any } = []
  clientsCount = 0

  ngOnInit(): void {
    this.nksErrorsHttpService.getNonBannedContacts().subscribe((data) => {
      this.nonBannedClients = data

      this.clientsCount = Object.keys(this.nonBannedClients).length
    })
  }
}
