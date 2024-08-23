export interface DcAdditionalDocsFields {
  AssignmentLetter: boolean | null
  FactoringContract: boolean | null
  Abstract: boolean | null
  WritingOffContract: boolean | null
  GuaranteeLetter: boolean | null
  AccruingAppendix: boolean | null
  Originals: boolean | null
  IndividualTerm: string

  SendingWays?: string
  PostOfficeAddress?: string

}

export const dcAdditionalDocsFieldsFilled = (docs: DcAdditionalDocsFields) => Object.values(docs).some(value => value === true)


