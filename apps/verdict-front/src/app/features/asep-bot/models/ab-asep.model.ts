export interface ASEPModel {
  cache: [
    {
      Filename: string,
      ProcessingType: string,
      ProcessingStage: string,
      Information: string,
      MustSeeErrors: string[],
      Warnings: string[],
      Errors: string[],
      Percent: number
    }
  ] | null
}
