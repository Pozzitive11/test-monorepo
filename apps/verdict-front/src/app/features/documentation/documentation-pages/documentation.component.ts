import { Component, OnInit, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { CommonModule, NgFor } from '@angular/common'
import { DocumentationService } from '../services/documentation.service'

@Component({
  selector: 'documentation-table',
  templateUrl: './documentation.component.html',
  standalone: true,
  imports: [RouterLink, CommonModule, NgFor],
  styles: [
    `
      .nav-link {
        border: 1px solid #1277da;
        margin: 0.2rem 0;
      }
      .nav-pills {
        border-left: 1px dotted #1277da;
        padding-left: 1rem;
      }
    `
  ]
})
export class DocumentationComponent implements OnInit {
  protected documentationService = inject(DocumentationService)

  allEP = {
    show: true,

    openedEP: {
      show: false
    },

    stopEP: {
      show: false
    }
  }
  ngOnInit(): void {
    this.documentationService.getDocList()
  }

  toggleAllEP() {
    this.allEP.show = !this.allEP.show
  }
}
