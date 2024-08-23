import { DcPromotionSimpleModel } from './dc-promotion-simple.model'
import { dctTypesShortValues } from './dc-template-models/dct-types.enum'

export interface DcPromotionSimpleWithDocsReqModel extends DcPromotionSimpleModel {
  ReqId: number
  DocType: dctTypesShortValues
  RequestDate: Date
  CheckDate: Date | null
  CreatedBy: string
}
