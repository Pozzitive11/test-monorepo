export interface FilterModel {
  not: boolean,
  empty: boolean,
  includes?: string,
  startsWith?: string,
  endsWith?: string,
  eq?: string | number,
  le?: number,
  ge?: number,
  less?: number,
  greater?: number,
  in?: string[]
}

