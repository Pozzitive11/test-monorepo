import { Signal } from '@angular/core'
import { SIGNAL } from '@angular/core/primitives/signals'
import { TTable } from '../models/basic-types'

export type ToSignals<T> = { [K in keyof T]: Signal<T[K]> }

export function objectIsSignal<T>(obj: any): obj is Signal<T> {
  try {
    return SIGNAL in obj
  } catch (e) {
    return false
  }
}

export const getColumnDataType = (data: TTable, col: string) => {
  if (data.length === 0) return 'undefined'

  const allTypes = [...new Set(data.map((value) => typeof value[col]))]
  return allTypes.length === 1 ? allTypes[0] : 'mixed'
}
