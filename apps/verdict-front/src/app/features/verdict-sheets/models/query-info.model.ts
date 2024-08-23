import { ITableInspectorInfoModel } from './table-inspector-info.model'
import { TDbServers } from './vserdict-sheet.types'

export interface IColumnInfoModel {
  table_name: string | null
  column_name: string | null
  alias: string
  editable: boolean
  unique: boolean
  ordinal: number | null
  db: TDbServers | null
  related_key: string | null
  for_insert: boolean
  dictionary_id: number | null
}

export interface ITableInfoModel {
  table_name: string
  inspector_info: ITableInspectorInfoModel[]
}

export interface IQueryInfoModel {
  db: TDbServers
  selected_columns: IColumnInfoModel[]
  tables: ITableInfoModel[]
}

export interface IQueryInfoModelFull extends IQueryInfoModel {
  sheet_uid: string
  sql_query: string
  sheet_name: string
  group_name: string | null
}
