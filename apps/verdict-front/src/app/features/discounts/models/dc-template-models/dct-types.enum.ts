export enum dctTypesShortEnum {
  ASSIGNMENT_LETTER = 'Інформаційний лист',
  // FACTORING_CONTRACT = 'Договір факторингу',
  ABSTRACT = 'Витяг',
  WRITING_OFF_CONTRACT = 'Угода про списання частини боргу',
  GUARANTEE_LETTER = 'Гарантійний лист',
  // ACCRUING_APPENDIX = 'Додаток про нарахування',
  // ORIGINALS = 'Оригінал КД',
}

export type dctTypesShortKeys = keyof typeof dctTypesShortEnum
export type dctTypesShortValues = typeof dctTypesShortEnum[dctTypesShortKeys]

export const dctBuildEndPointsMap = new Map<dctTypesShortValues, string>([
  [dctTypesShortEnum.ASSIGNMENT_LETTER, 'build_inform_letter_template'],
  [dctTypesShortEnum.WRITING_OFF_CONTRACT, 'build_agreement_template'],
  [dctTypesShortEnum.GUARANTEE_LETTER, 'build_guarantee_letter_template'],
  [dctTypesShortEnum.ABSTRACT, 'build_abstract_template']
])


export enum dctTypesFullEnum {
  WritingOffContract = 'Угода про списання частини боргу',
  AssignmentLetter = 'Інформаційний лист',
  GuaranteeLetter = 'Гарантійний лист',
  Abstract = 'Витяг',
  FactoringContract = 'Договір факторингу',
  AccruingAppendix = 'Додаток про нарахування',
  Originals = 'Оригінал КД',
}

export type dctTypesFullKeys = keyof typeof dctTypesFullEnum
export type dctTypesFullValues = typeof dctTypesFullEnum[dctTypesFullKeys]

export const isDctTypesFullKeys = (key: string): key is dctTypesFullKeys => Object.keys(dctTypesFullEnum).includes(key)

export const dctTypesUrkToEng = Object.keys(dctTypesFullEnum).reduce((acc, key) => {
  if (!isDctTypesFullKeys(key))
    return acc

  acc[dctTypesFullEnum[key]] = key
  return acc
}, {} as { [key: string]: dctTypesFullKeys })
