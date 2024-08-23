import { TCellEdit, TRow } from '../../../shared/models/basic-types'

export interface ISheetChangeAddModel {
  uid: string
  action: 'add'
  change: TCellEdit
}

export interface ISheetChangeDeleteModel {
  uid: string
  action: 'delete'
  items: TCellEdit[]
}

export interface ISheetChangeDropModel {
  uid: string
  action: 'drop'
}

export interface ISheetChangeReplaceModel {
  action: 'replace' | 'commit_saved'
  uid: string
  items: TCellEdit[]
}

export interface ISheetChangeRowsUpdateModel {
  uid: string
  action: 'rows-update'
  rows: TRow[]
}

export interface ISheetChangeCommitModel {
  action: 'commit'
  uid: string
}

export type ISheetChangeUpdateModel = (
  ISheetChangeAddModel
  | ISheetChangeDeleteModel
  | ISheetChangeDropModel
  | ISheetChangeReplaceModel
  | ISheetChangeRowsUpdateModel
  | ISheetChangeCommitModel
  )
