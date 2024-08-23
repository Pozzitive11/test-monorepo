export interface DcClosingCertificate {
  id: number
  ContractId: number
  ProjectName: string
  RequestDate: string
  RequestBy: string
  EntryDate?: string
  PaymentDateLimit?: string
  Debt?: number
  DiscountPercent?: number
  RestructuringMonths?: number | null
  SumToPay?: number
  DebtOnPurchase?: number
  Currency?: string
  TotalPaymentSum?: number
  OverPayment?: number
}
export interface DcFillClosingCertificateTemplateData {
  CertificateRequestId: number
  ContractId: number
  ClientName: string
  RefNumber: string
  RefNumberDate: Date
  ClientINN: string | null
  AssignmentDocNum: string | null
  AssignmentDocDate: Date | null
  ContractNum: string
  ContractDate: Date
  FirstCreditor: string | null
  Company: 'ДФ' | 'КЦ'
  Seller: string
  Buyer: string
  IsFullClosure: boolean
  LastPaymentDate: string
  PromotionEntryDate: string
  fileBlobName: string | null
  DocPath: string
  confirmed?: boolean
}
