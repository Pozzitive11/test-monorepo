import { Component, inject } from '@angular/core'
import { LrHttpService } from '../../services/lr-http.service'
import { MessageHandlingService } from '../../../../shared/services/message-handling.service'
import { ContractPromotionsInfoModel } from '../../models/contract-promotions-info.model'
import { Router } from '@angular/router'
import { LrDataService } from '../../services/lr-data.service'
import { LrContractPromotionCardComponent } from '../../components/cards/lr-contract-promotion-card/lr-contract-promotion-card.component'
import { FormsModule } from '@angular/forms'
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'lr-past-info-page',
  templateUrl: './lr-past-info-page.component.html',
  standalone: true,
  imports: [NgIf, NgbProgressbar, FormsModule, NgFor, LrContractPromotionCardComponent]
})
export class LrPastInfoPageComponent {
  private readonly httpService = inject(LrHttpService)
  private readonly messageService = inject(MessageHandlingService)
  private readonly router = inject(Router)
  private readonly dataService = inject(LrDataService)

  loading: boolean = false
  contractId: string = ''
  selectedContractId: string = ''

  contractPromotions: ContractPromotionsInfoModel[] = []

  getContractPromotions() {
    this.loading = true
    this.selectedContractId = this.contractId

    this.httpService.getContractPromotions(this.contractId).subscribe({
      next: (value) => (this.contractPromotions = value),
      error: (err) => {
        this.messageService.sendError(err.error.detail)
        this.loading = false
      },
      complete: () => (this.loading = false)
    })
  }

  selectPromotion(promotionId: number) {
    this.dataService.selectedContractId = +this.selectedContractId
    this.router.navigate(['discounts', 'long_requests', 'promotion', promotionId])
  }

  createPromotion() {
    this.dataService.selectedContractId = +this.selectedContractId
    this.router.navigate(['discounts', 'long_requests', 'create_promotion', this.selectedContractId])
  }
}
