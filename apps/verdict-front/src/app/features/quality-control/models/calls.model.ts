export interface Call {
  vrID: number
  ContractId: string | null
  Login: string
  StartTime: string
  Duration: number
  PhoneNumber: string
  CallType: string
  [key: string]: any
}

export interface CallSearchParameters {
  RecordId?: number
  StartDate?: string | null
  FinishDate?: string | null
  Login?: string
  TelNumber?: string
  MaxDuration?: number
  MinDuration?: number
  Limit?: number
  IsDetails?: boolean
}

export interface ChildRecords {
  StartTime: string
  Duration: number
  FileName: string
}
