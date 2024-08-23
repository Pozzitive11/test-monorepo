export interface MegaSolvencyModel {
  LastCheckDate?: Date
  CrossingInfo: {
    YearOfCrossing?: number
    Description: string
  }[]
  LastCrossingDate?: Date
  LastCrossingDirection?: string
}



