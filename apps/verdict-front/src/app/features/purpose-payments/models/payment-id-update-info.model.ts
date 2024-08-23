import { ProcessInfoModel } from '../../../data-models/server-data.model'
import { PaymentCheckModel } from './payment-check.model'

export interface PaymentIdUpdateInfoModel {
  ProcessInfo: ProcessInfoModel
  PaymentChecks: PaymentCheckModel[]
}
