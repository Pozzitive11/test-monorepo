export interface DictionaryFullModel {
  id: number
  Name: string
  SpecId?: number
  Description?: string
}

export function isDictionaryFullModel(obj: any): obj is DictionaryFullModel {
  return obj && typeof obj === 'object' && 'id' in obj && 'Name' in obj
}
