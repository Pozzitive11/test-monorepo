import { Component, EventEmitter, Input, Output } from '@angular/core'
import { DctBasicPromotionInfoModel } from '../../../models/dc-template-models/dct-basic-promotion-info.model'
import { dctTypesShortValues } from '../../../models/dc-template-models/dct-types.enum'
import { DctWritingOffDataModel } from '../../../models/dc-template-models/dct-writing-off-data.model'
import { DctInformLetterDataModel } from '../../../models/dc-template-models/dct-inform-letter-data.model'
import { DctAbstractDataModel } from '../../../models/dc-template-models/dct-abstract.data.model'
import { NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'dct-list',
  templateUrl: './dct-list.component.html',
  standalone: true,
  imports: [NgFor, NgIf]
})
export class DctListComponent {
  @Input() selectedTemplate: DctBasicPromotionInfoModel | null = null
  @Input() shownTemplateData: DctWritingOffDataModel | DctInformLetterDataModel | DctAbstractDataModel | null = null
  @Input() templatesList: DctBasicPromotionInfoModel[] = []
  @Input() currentStep: number = 0

  @Output() selectTemplate = new EventEmitter<DctBasicPromotionInfoModel>()
  @Output() removeTemplate = new EventEmitter<{ id: number, templateType: dctTypesShortValues | null }>()
  @Output() confirmTemplate = new EventEmitter<{ id: number, templateType: dctTypesShortValues | null }>()

}
