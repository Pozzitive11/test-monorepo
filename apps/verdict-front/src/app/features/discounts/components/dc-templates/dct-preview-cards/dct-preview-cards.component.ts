import { Component, EventEmitter, Input, Output } from '@angular/core'
import { DctBasicPromotionInfoModel } from '../../../models/dc-template-models/dct-basic-promotion-info.model'
import { dctTypesShortValues } from '../../../models/dc-template-models/dct-types.enum'
import { DctBaseModel } from '../../../models/dc-template-models/dct-base.model'
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer'
import { NgIf } from '@angular/common'

@Component({
  selector: 'dct-preview-cards',
  templateUrl: './dct-preview-cards.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgxExtendedPdfViewerModule,
    NgbProgressbar
  ]
})
export class DctPreviewCardsComponent {
  @Input() shownTemplate: number = 0

  @Input() dataList: {
    PromotionId: number
    ContractId: number
    ClientName: string | null
    ClientINN: string | null
  }[] = []

  @Input() selectedTemplate: DctBasicPromotionInfoModel | null = null
  @Input() shownTemplateData: DctBaseModel | null = null

  @Output() shownTemplateChange = new EventEmitter<number>()
  @Output() reloadFile = new EventEmitter<{ id: number, templateType: dctTypesShortValues | null } | null>()
  @Output() downloadTemplates = new EventEmitter()
  @Output() deleteTemplate = new EventEmitter<number>()
  @Output() toggleCheck = new EventEmitter<number>()

}
