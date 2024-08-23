import { ProjectRnumberRowModel, ProjectRnumberTableModel } from '../abstract-classes/project-rnumber.class'

export interface SegmentsRPCNCRegion {
  region_type: string
  count: number
}

export interface SegmentsRPCNC {
  project: string
  position: string
  level: number
  underPosition?: string
  data: SegmentsRPCNCRegion[]
}

export interface RPCNCInfoModel {
  ReestrType: string
  ReestrStatus: string
  RNumber: number
  Category?: string
  RegionType?: string
  ContractsCount: number
  actualCount: number
  nonActualCount: number
  noPhone: number
  UpdateDate: string
}

export interface RPCNCEndInfoModel {
  TotalContractsCount: number
  StopListCount: number
  InWorkCount: number
  DebtLess200Count: number
  ToWorkCount: number
  RPCCount: number
  APTPCount: number
  PTPNoPaymentCount: number
  PTPPaymentCount: number
  DeniedLE3Count: number
  DeniedM3Count: number
  ElseCount: number
  NoRPCCount: number
  NoContactCount: number
  NoContactActualPhoneCount: number
  NoContactNoActualPhoneCount: number
  NoPhoneCount: number
  UpdateDate: string
}

// new EVERYDAY CC REPORT INTERFACES
export interface EverydayCCWorkModel {
  ProjectName: string             // 'Проєкт',
  ADate: Date | string            // 'Дата',
  Rnumber: string | number        // 'Номер реєстру',

  PTPCount: number                // 'Кількість РТР',
  PTPSum: number                  // 'Сума РТР',
  PTPUnicCount: number            // 'Кількість нових РТР',
  PTPUnicSum: number              // 'Сума нових РТР, грн',
  Prc?: number                    // 'Комісія, %',

  RPCcount: number                // 'Кількість RPC',
  RPCUnic196: number              // 'Дзвінок вх.',
  RPCUnic202: number              // 'Дзвінок вих. (авт.)',
  RPCUnic210: number              // 'Дзвінок вих. (руч.)',
  RPCUnicCount: number            // 'Всього',

  ReestrType: number              // 'Айді типу реєстру',
}

interface EverydayCCWorkRow {
  PTPCount: number                // 'Кількість РТР',
  PTPSum: number                  // 'Сума РТР',
  Prc?: number                    // 'Комісія, %',
  IncomeFromPTP: number           // 'Дохід за сумою поставлених РТР',
  RPCcount: number                // 'Кількість RPC',
  PTPtoRPCPercent: number         // 'РТР/RPC %',
  PTPUnicCount: number            // 'Кількість нових РТР',
  PTPUnicSum: number              // 'Сума нових РТР, грн',

  // Нові RPC
  RPCUnic196: number              // 'Дзвінок вх.',
  RPCUnic202: number              // 'Дзвінок вих. (авт.)',
  RPCUnic210: number              // 'Дзвінок вих. (руч.)',
  RPCUnicCount: number            // 'Всього',

  hidden: boolean
}

export interface EverydayCCWorkRnumberRow extends EverydayCCWorkRow {
  ADate: Date | string                     // 'Дата',
}

export interface EverydayCCWorkDateRow extends EverydayCCWorkRow {
  Rnumber: string | number        // 'Номер реєстру',
}

export interface EverydayCCWorkRnumberTable {
  ProjectName: string
  ProjectData: {
    Rnumber: string | number
    RnumberData: EverydayCCWorkRnumberRow[]
    hidden: boolean
  }[]
}

export interface EverydayCCWorkDateTable {
  ProjectName: string
  ProjectData: {
    ADate: Date | string
    ADateData: EverydayCCWorkDateRow[]
    hidden: boolean
  }[]
}

// new EVERYDAY CC REPORT INTERFACES


export interface IncomeTableModel extends ProjectRnumberTableModel {
  rows: IncomeRowModel[]
}

export interface IncomeRowModel extends ProjectRnumberRowModel {
  DatePay: string                 // 'Дата',
  Prc: number                     // 'Комісія, %',
  AllPay: number                  // 'Сума збору , грн',
  Income: number                  // 'Сума доходу, грн',
  MaxDatePayReestr: string        // 'Дата оновлення оплат',
}


export interface IncomeModel {
  ProjectName: string
  Rnumber: number | string
  DatePay: Date
  AllPay: number
  Prc: number
  Income: number
  MaxDatePayReestr: Date
  ReestrTypeId: number
  ReestrType: string
}

export interface IncomeRow {
  AllPay: number
  Prc: number
  Income: number
  MaxDatePayReestr: Date
  hidden: boolean
}

export interface IncomeRnumberRow extends IncomeRow {
  DatePay: Date | string
}

export interface IncomeDateRow extends IncomeRow {
  Rnumber: number | string
}

export interface IncomeRnumberTable {
  ProjectName: string
  ProjectData: {
    Rnumber: string | number
    RnumberData: IncomeRnumberRow[]
    hidden: boolean
  }[]
}

export interface IncomeDateTable {
  ProjectName: string
  ProjectData: {
    DatePay: Date | string
    DatePayData: IncomeDateRow[]
    hidden: boolean
  }[]
}


export interface CCMailsRowModel extends ProjectRnumberRowModel {
  ActivityDate: string            // 'Дата відправки',
  TemplateName: string            // 'Шаблон листа',
  LetterCount: number             // 'Кількість відправлених листів',
  PromiseAmount: number           // 'Сума вимоги',
  PromiseDate: string             // 'Дата вимоги',
  PaymentsCount: number           // 'Кількість платежів, що надійшли',
  PaymentSum: number              // 'Сума платежів, що надійшли',
  Blank: string                   // 'Бланк',
  Sender: string                  // 'Відправник листів',
}

export interface CCMailsModel {
  ProjectName: string             // 'Проєкт',
  RNumber: number | string        // 'RNumber',
  TemplateName: string            // 'Шаблон листа',
  ActivityDate: string            // 'Дата відправки',
  LetterCount: number             // 'Кількість відправлених листів',
  PromiseDate: string             // 'Сума вимоги',
  PromiseAmount: number           // 'Дата вимоги',
  PaymentsCount: number           // 'Кількість платежів, що надійшли',
  PaymentSum: number              // 'Сума платежів, що надійшли',
  Blank: string                   // 'Бланк',
  Sender: string                  // 'Відправник листів',
}

export interface CCMailsRowModel extends ProjectRnumberRowModel, CCMailsModel {
  TemplateNum?: number
}

export interface CCMailsTableModel extends ProjectRnumberTableModel {
  rows: CCMailsRowModel[]
}


export interface IntersectionsINNModel {
  ProjectName: string                         // 'Проєкт'
  UniqueInnBought: number                     // 'Кількість унікальних ІПН на момент купівлі'
  UniqueContractsBought: number               // 'Кількість унікальних НКС на момент купівлі'
  UniqueInnToday: number                      // 'Кількість унікальних ІПН на сьогодні'
  UniqueContractsToday: number                // 'Кількість унікальних НКС на сьогодні'
  FullyUniqueInnToday: number                 // 'Кількість унікальних ІПН без суміжних на сьогодні'

  InGroup: number                             // 'Кількість суміжних ІПН в обраних реєстрах проєкту'
  FactoringNonCollateral: number              // 'Кількість суміжних ІПН Факторинг Беззалоги'
  FactoringCollateral: number                 // 'Кількість суміжних ІПН Факторинг Залоги'
  Commission: number                          // 'Кількість суміжних ІПН Комісія'
  InSLPositive: number                        // 'Кількість суміжних ІПН Вічний стоп-лист (позитивний)'
  InSLNegative: number                        // 'Кількість суміжних ІПН Вічний стоп-лист (негативний)'
}


export interface ProjectEPReturns {
  ProjectName: string             // 'Проєкт'
  AgeBucket: string               // 'Віковий бакет'
  InnCount: string                // 'Кількість ІПН'
  DebtSumToDemand: string         // 'Сума боргу на вимогу'
  BodyArrearsAmount: string       // 'Сума прострочення по тілу'
  IP5Count?: string               // 'ВП 5'
  IP10Count?: string              // 'ВП 10'
  IP15Count?: string              // 'ВП 15'
  IP25Count?: string              // 'ВП 25'
  IP50Count?: string              // 'ВП 50'
  IPCount?: string                // 'Відкрито ВП'
  RPCCount: string                // 'ІПН з RPC'
  PTPCount: string                // 'ІПН з PTP'
  ActualPaymentsAmount: string    // 'Сума фактичних платежів'
  ActualPayersInnCount: string    // 'Кількість ІПН з фактичними оплатами'
  GISVirtualPaymentsSum: string   // 'Сума платежів ГІС та Віртуальні'
  GISVirtualInnCount: string      // 'Кількість ІПН з платежами ГІС та Віртуальні'

  ProjectNum: number              // порядковый номер проекта в таблице
  RowNum: number                  // порядковый номер строки
}


export interface TimePlanFact {
  ProjectName: string             // Проєкт
  WTimePlan: number              // План по годинах місяць
  WTimePlanNow: number           // План по годинах на дату
  WTimeFact: number              // Факт по годинах на дату
  Deviation: number              // Відхилення на дату
  PRC: number                    // % виконання
}

export interface TimePlanFactSwitchable extends TimePlanFact {
  excludeEP: boolean
}

export interface TimePlan {
  ProjectName: string
  PlanType?: string
  WTimePlan?: number
  WTimePlanNow?: number
}

export interface TimeFact {
  ProjectName: string
  EPFlag: string
  WTimeFact?: number
}

export interface TimePlanFactReport {
  Plan: TimePlan[]
  Fact: TimeFact[]
}


export interface SegmentationModel {
  ContractId: number
  ProjectName: string
  RNumber: number
  DPD: number
  ActualPhonesCount: number
  ActualPhonesCountMobile: number
  AnyPhonesCount: number
  Debt: number
  Outstanding: number
  SumDelayBody: number
  BalancePercent: number
  Fine: number
}

export interface SegmentationNewPivotModel {
  ContractCount: number                                  // 'Кількість КД'
  ContractCountProjectPercent: number                    // 'Кількість КД %'
  SumDelayBody: number                                   // 'Тіло'
  Outstanding: number                                    // 'Outstanding'
  BalancePercent: number                                 // 'Відсотки'
  SumDelayBodyPercent: number                            // 'Тіло %'
  DebtPartPercent: number                                // 'Доля'
  BodyAvg: number                                        // 'Тіло_avg'
  OutstandingAvg: number                                 // 'Outstanding_avg'
  DpdAvg: number                                         // 'Dpd_avg'
  Deviation: number | undefined                          // 'Відхилення від середнього'
}

export interface PhoneData {
  PhonePresence: string
  data: SegmentationNewPivotModel
}

export interface SegmentationTotalTableModel {
  project: string
  phoneData: PhoneData[]
}

export interface BucketData {
  bucket: string
  data: SegmentationNewPivotModel
  hidden: boolean
}

export interface PhoneBucketData {
  PhonePresence: string
  bucketData: BucketData[]
  hidden: boolean
}

export interface SegmentationBucketTableModel {
  project: string,
  phoneData: PhoneBucketData[]
}

export interface DebtDpdBucketSingleData {
  ContractCount: number                     // 'Кількість КД'
  ContractCountPercent: number              // 'Кількість КД %'
  SumDelayBody: number                      // 'Тіло'
  SumDelayBodyPercent: number               // 'Тіло %'
  Outstanding: number                       // 'Outstanding'
  OutstandingPercent: number                // 'Outstanding %'
  BodyAvg: number                           // 'Тіло_avg'
  OutstandingAvg: number                    // 'Outstanding_avg'
}

export interface DebtBucketSingleData {
  debtBucket: string
  data: DebtDpdBucketSingleData[]
}

export interface DebtBucketData {
  debtBucket: string
  hidden: boolean
  dpdValues: number[]
}

export interface RowsDebtDpdData {
  ContractCount: DebtBucketData[]           // 'Кількість КД'
  ContractCountPercent: DebtBucketData[]    // 'Кількість КД %'
  SumDelayBody: DebtBucketData[]            // 'Тіло'
  SumDelayBodyPercent: DebtBucketData[]     // 'Тіло %'
  Outstanding: DebtBucketData[]             // 'Outstanding'
  OutstandingPercent: DebtBucketData[]      // 'Outstanding %'
  BodyAvg: DebtBucketData[]                 // 'Тіло_avg'
  OutstandingAvg: DebtBucketData[]          // 'Outstanding_avg'
}

export interface DebtDpdPhoneData {
  PhonePresence: string
  hidden: boolean
  data: RowsDebtDpdData
}

export interface SegmentationDebtDpdTableModel {
  project: string
  phoneData: DebtDpdPhoneData[]
}


export interface RpcNcInfoInputData {
  regionType: string
  isInvestProjects: boolean
  position: string
  project: string
  StartDate?: Date
  EndDate?: Date
}

export interface RpcNcInfoInputDataFromContracts {
  regionType: string
  isInvestProjects: boolean
  contracts: number[]
}

export interface RpcNcInfoModel {
  ProjectName: string
  RNumber: number
  ContractId: number
  SumToClose: number
  INN: string
  Surname: string
  Name: string
  MiddleName: string
  RegionType: string
}

export interface RpcNcInfoModelWithHead {
  header: string[]
  data: RpcNcInfoModel[]
}

export interface PhoneSegmentationModel {
  ContractId: number
  Phone: string
  CallsCount: number
  TriesCount: number
  // ContractImport?: string
  PhoneStatus: string
  PhoneType?: string
  // LastActionDate?: Date
  // LastCallTryDate?: Date
}

export interface rangeTuple {
  name: string,
  value: [(number | null), (number | null)],
  selectedContract: boolean
  selectedPhone: boolean
}

export interface PhoneContractSegmentationTable {
  range: string
  contracts: number[]
  contractsCount: number
}

export interface PhoneContractSegmentationReport {
  actions: PhoneContractSegmentationTable[]
  tries: PhoneContractSegmentationTable[]
}

export interface PhoneSegmentationTable {
  range: string
  contractsPhones: {
    contract: number
    phone: string
  }[]
  phonesCount: number
}

export interface PhoneSegmentationReport {
  actions: PhoneSegmentationTable[]
  tries: PhoneSegmentationTable[]
}

export interface PhonesSegmentationPivotModel {
  contracts: PhoneContractSegmentationReport
  phones: PhoneSegmentationReport
}


export interface PlansInfoModel {
  ProjectName: string
  TimePlan: number
  PlanType?: string
}
















