import { TDbServers } from './vserdict-sheet.types'

export interface ISheetDictionaryModel {
  id: number | null
  name: string
  db: TDbServers
  query: string
}
