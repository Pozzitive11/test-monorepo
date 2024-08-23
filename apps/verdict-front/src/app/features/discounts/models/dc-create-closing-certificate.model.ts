export interface DcClosingCertificateDetails {
  EntryDate: string
  ContractOriginal: boolean
  DiscountPercent: number
  RestructuringMonths: number | null
  PaymentDateLimit: string
}

export interface DcClosingCertificate {
  IsFullClosure: boolean
  LastAgreedPromotion: DcClosingCertificateDetails
}

export interface DcClosingCertificateToSave {
  ContractId: number
  IsFullClosure: boolean | undefined
  SendingDetails: {
    MethodId: number
    AddressDetails: string
  }[]
}
