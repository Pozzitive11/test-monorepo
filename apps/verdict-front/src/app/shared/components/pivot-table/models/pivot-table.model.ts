import { TValue } from '../../../models/basic-types'

export interface PivotTableModel {
  [row: string]: {
    [col: string]: TValue
  }
}

export interface PivotTableTemp {
  [row: string]: {
    [col: string]: TValue[]
  }
}
