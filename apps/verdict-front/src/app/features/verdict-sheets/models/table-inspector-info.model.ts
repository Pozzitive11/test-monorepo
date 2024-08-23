export interface IColumnTypeModel {
  ts_type: 'number' | 'string' | 'boolean' | 'Date' | 'unknown'
  python_type: 'int' | 'str' | 'bool' | 'datetime' | 'date' | 'time' | 'float' | 'Any'
  original_type: string
  length: number | null // for string types only
}

export interface ITableInspectorInfoModel {
  name: string
  type: IColumnTypeModel
  nullable: boolean
  default: string | null
  autoincrement: boolean | 'auto'
  unique: boolean
}
