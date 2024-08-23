export interface Supervisor {
  Id: number
  FullName: string
  Login: string
  RoleName: string
}
export interface ListType {
  id: number
  name: string
}
export interface SelectList {
  id: number
  Name: string
}

export interface ConversationLengthList extends SelectList {
  MaxSeconds?: number
}
export interface Contragent {
  id: number
  Name: string
  NameRUS: string
}

export type Operator = Supervisor
export type Recruiter = Supervisor

export interface CallType {
  id: number
  Name: string
}
export interface CheckboxMark {
  isSelected: boolean
  coefficient: number
  id: number
}
export interface Mark {
  Id: number
  Coefficient: number
  Name: string
  Description: string
  ListType?: number
}
export interface Penalty {
  Id: number
  Penalty: number
  Name: string
  Description: string
  ListType?: number
}
export interface Score {
  Id: number
  MonitoringId: number
  ScoreTypeId: number
}
export interface Fine {
  Id: number
  MonitoringId: number
  FineTypeId: number
}
export interface MonitoringInfo {
  CallId: string
  PhoneNumber: string
  UserId: number
  ContractId: number
  Strong: string
  Weak: string
  ContactWithId: number
  CallResultId: number
  CallTypeId: number
  DiscountMarkId: number
  Comment: string
  ListType: number
  CallDate: string
  CallDescriptionIds: CallType[]
  CallProblemId: number
  CallLengthId: number
  Id: number
  MonitoringDate: string
  ManagerId: number
}

export interface DeletedMonitoringInfo {
  Coefficient: number
  Name: string
  Description: string
  ListType: number
  Id: number
}

export interface BaseReport {
  list_type_id: number
  start_date: string
  end_date: string
  contragent_list_id: Array<number>
  supervisor_list_id: Array<number>
  specialists_skk_list_id: Array<number>
  oper_recr_list_id: Array<number>
  only_test_call: boolean
  exept_test_call: boolean
  only_tot_score: boolean
  only_tot_fine: boolean
}
export interface ReportByGpa extends BaseReport {
  show_pib_oper_recr: boolean
  add_gr_by_contragent: boolean
  count_mistake: boolean
}

export interface ReportByPeriod extends BaseReport {
  show_pib_oper_recr: boolean
  show_nks: boolean
  show_pib_supervisor: boolean
  show_pib_specialists_skk: boolean
  show_contact_with: boolean
  show_call_result: boolean
  show_call_type: boolean
  exept_weekend: boolean
  show_restr_discount: boolean
  show_strong_side: boolean
  show_weak_side: boolean
  show_comment: boolean
  show_call_id: boolean
  show_phone: boolean
}

export interface Nks {
  id: number
  ReestrRNumber: number
  ReestrName: string
  ContragentName: string
  ContragentNameRUS: string
}
