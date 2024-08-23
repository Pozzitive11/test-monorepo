export interface DcScoringModel {
  min: number
  max: number
  DC: {
    MWO: number             // max write off
    MBP: number | null      // min body payment
  } | null
  RS: {
    MM: number              // max months
    MP: number              // min payment
  } | null
  IA: boolean
}
