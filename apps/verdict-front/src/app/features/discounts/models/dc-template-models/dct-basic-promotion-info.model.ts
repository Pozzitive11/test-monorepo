import { dctTypesShortValues } from './dct-types.enum'

export interface DctBasicPromotionInfoModel {
  id: number
  contractId: number
  clientName: string | null
  projectManager: string | null
  projectName: string | null
  templateType: dctTypesShortValues | null
  confirmed: boolean
}
