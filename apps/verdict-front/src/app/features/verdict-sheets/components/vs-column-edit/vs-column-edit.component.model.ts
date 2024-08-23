import { IColumnInfoModel, ITableInfoModel } from '../../models/query-info.model'

export interface IColumnEditComponentModel {
  column: IColumnInfoModel
  tables: ITableInfoModel[]
}
