export interface ServerDropdownModel {
  column: string
  values: string[]
}


export interface ServerDropdownDependedModel extends ServerDropdownModel {
  column_dependency: string
  value_dependency: string
}


export interface GlobalFilters {
  min_date?: string
  max_date?: string
  files: string[]
  bufferType?: string
}


export interface ServerDataModel {
  data: { [key: string]: any }[]
  editable_cols: string[]
  cols_type: { [key: string]: string }
  dropdowns: ServerDropdownModel[]
  dropdowns_depended: ServerDropdownDependedModel[]
}


export interface AuthResponseData {
  username: string
  homePage: string
  id: number
  access_token: string
  pages: string[]
  expiresAt: Date
  role: string
}

export interface UpdateInfo {
  ids: string[]
  changes: {
    col: string,
    value: any,
    saveChange: boolean
  }[]
}

export interface DataChange {
  id: string[]
  col: string
  new_value: any
}

export interface ProcessInfoModel {
  errors: string[]
  info: string[]
}

export interface ServerBasicResponse {
  description: string
  header: any
  content: any
  links: any
  status_code: number
}
export interface SenderResponse {
  senders: string[];
}

export interface ServerDataStringList {
  data: string[]
}

export interface PaymentsProcessingInfo {
  uid: any
  status: string
  progress_info: string
  progress_percent: number
  errors_list: string[]
  info_list: string[]
  end_file: string | undefined | null
}



