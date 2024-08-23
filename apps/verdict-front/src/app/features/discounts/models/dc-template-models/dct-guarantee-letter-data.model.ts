import { DctLetterBaseModel } from './dct-letter-base.model'

export interface DctGuaranteeLetterDataModel extends DctLetterBaseModel {
  IsEPOpen: boolean | null
  Agreed: string | null
  DebtTypeUsed: string | null
  SumToPay: number | null
  SumToClose: number | null
  PaymentDateLimit: string | null
}
