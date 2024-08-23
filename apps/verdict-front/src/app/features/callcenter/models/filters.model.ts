export interface DictionaryModel {
  id: number
  Name: string
}

export interface ReestrFilterModel {
  Rnumber: number
  ReestrName: string
}

export interface ManagerFilterModel {
  ManagerId: number
  ManagerName: string
}

export interface InputProjectParameters {
  isActual: boolean
  ManagerID: number[]
}

export interface InputReestrParameters {
  isActual: boolean
  ReestrTypes: number[]
  ReestrStatuses: number[]
  ProjectID: number[]
}

export interface ProjectFilterModel {
  ID: number
  ProjectName: string
}

export interface InputFilterParameters {
  Rnumber: number[]
  StartDate: Date
  EndDate: Date
  isInvestProjects: boolean
}

export interface InvestProjectsModel {
  id: number
  Name: string
  ProjectGroup: string
}

export interface InputReestrFromInvestProjects {
  isActual: boolean
  ReestrTypes: number[]
  ReestrStatuses: number[]
  ProjectIDs: number[]
}

export interface IntersectionsINNFilters {
  RNumbers: number[]
  isInvestProjects: boolean
}

export interface InputCCMailsModel {
  Year: number
  Month: number
  RNumber: number[]
  payDayStart: number
  payDayEnd: number
  isInvestProjects: boolean
}


export interface InputProjectEPReturns {
  Rnumber: number[]
  AgeBuckets: string[]
  IPFilter: string[]
  isInvestProjects: boolean
}


export interface InputTimePlanFact {
  StartDate: Date
  EndDate: Date
  ExcludedLogins: string[]
}


export interface InputSegmentation {
  RNumber: number[]
  isInvestProjects: boolean
}

export interface InputSegmentationDebtDPD {
  DPD: string[]
  Debts: string[]
  phoneTypes: string[]
}

export interface InputDPDSegmentation {
  DPD: string[]
  phoneTypes: string[]
}

export interface InputDebtSegmentation {
  Debts: string[]
  phoneTypes: string[]
}

export interface InputTotalSegmentation {
  phoneTypes: string[]
}

export interface SegmentationPivotModel {
  project: string
  data: { [key: string]: any }[]
  partsCount: number
}

export interface BucketsToSaveModel {
  buckets: string[]
  bucketsType: string
}

export interface InputRPCNCInfoModel {
  ReestrTypes: number[]
  ReestrStatuses: number[]
}






