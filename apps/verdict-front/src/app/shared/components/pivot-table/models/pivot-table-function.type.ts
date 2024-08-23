import { TValue } from '../../../models/basic-types'

export type PivotAggFunction = (source: TValue[]) => TValue

export type PivotNumberAggFunction = (source: TValue[]) => number
