export type TValue = string | number | boolean | null | undefined | object
export type TValueExtended = TValue | TValue[]

export type TRow = { [key: string]: TValue }
export type TRowExtended = { [key: string]: TValueExtended }

export type TTable = TRow[]
export type TTableExtended = TRowExtended[]

export type TCellEdit = {
  id: number | string
  table: string
  column: string
  alias: string
  oldValue: TValue
  newValue: TValue
  changedAt: string
  dictionary_id?: number
  db: '56' | '64' | '68'
  sheet_uid: string
  user_login: string
}

export const theSameCellEdit = (a: TCellEdit, b: TCellEdit) => (
  a.id === b.id && a.table === b.table && a.column === b.column
  && (
    a.oldValue === b.oldValue && a.newValue === b.newValue
    || a.dictionary_id && b.dictionary_id && a.dictionary_id === b.dictionary_id
  )
)

export const theSameCell = (a: TCellEdit, b: TCellEdit) => (
  a.id === b.id && a.table === b.table && a.column === b.column
)
