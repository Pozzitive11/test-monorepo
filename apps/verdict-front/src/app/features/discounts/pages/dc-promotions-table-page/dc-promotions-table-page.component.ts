import { Component, inject, OnInit } from '@angular/core'
import { DcHttpService } from '../../services/dc-http.service'
import { DcPromotionsDataService } from '../../services/dc-promotions-data.service'
import { DcPromotionsFiltersService } from '../../services/dc-promotions-filters.service'
import { DcTemplatesService } from '../../services/dc-templates.service'
import { DcTemplateInformLetterService } from '../../services/templates/dc-template-inform-letter.service'
import { DctGuaranteeLetterService } from '../../services/templates/dct-guarantee-letter.service'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'dc-promotions-table-page',
  templateUrl: './dc-promotions-table-page.component.html',
  standalone: true,
  imports: [RouterOutlet]
})
export class DcPromotionsTablePageComponent implements OnInit {
  private readonly dataService = inject(DcPromotionsDataService)
  private readonly filterService = inject(DcPromotionsFiltersService)
  private readonly httpService = inject(DcHttpService)

  private readonly templateService = inject(DcTemplatesService)
  private readonly informLetterService = inject(DcTemplateInformLetterService)
  private readonly guaranteeLetterService = inject(DctGuaranteeLetterService)

  ngOnInit(): void {
    this.dataService.getDatesRange()
    this.templateService.getRefNumberCompanies()

    if (this.filterService.shownDataLength === 0) {
      this.dataService.loadOperators()
    }
    if (this.informLetterService.informLetterTemplatesData().length > 0) {
      this.informLetterService.informLetterTemplatesData().forEach(template => {
        this.httpService.resetLatestRefNumber(template.RefNumber, template.Company).subscribe()
      })
      this.informLetterService.informLetterTemplatesData.set([])
    }
    if (this.guaranteeLetterService.guaranteeLetterTemplatesData().length > 0) {
      this.guaranteeLetterService.guaranteeLetterTemplatesData().forEach(template => {
        this.httpService.resetLatestRefNumber(template.RefNumber, template.Company).subscribe()
      })
      this.guaranteeLetterService.guaranteeLetterTemplatesData.set([])
    }

  }
}
