import { dcAgreeTypeNames } from './dc-agree-type.names'

interface DcPromotionTableColors {
  table: {
    color: string
    name: string
    values: string[]
  }[]
}

export const dcPromotionTableColorsNames: DcPromotionTableColors[] = [
  {
    table: [
      { color: '#e4ffe4', name: 'Подані', values: dcAgreeTypeNames.submitted },
      { color: '#ffe4e4', name: 'Неподані', values: dcAgreeTypeNames.notSubmitted },
      { color: '#e4edff', name: 'Відправлені на погодження', values: dcAgreeTypeNames.inAgreement },
      { color: '#e8e8e8', name: 'Тільки документи', values: dcAgreeTypeNames.agreementDocs }
    ]
  },

  {
    table: [
      { color: '#f7e4ff', name: 'Погоджені', values: dcAgreeTypeNames.agreementConfirmed },
      { color: '#fffbe4', name: 'Довга', values: dcAgreeTypeNames.agreementLong },
      { color: '#ffcbcb', name: 'Відмова', values: dcAgreeTypeNames.agreementDenied },
      { color: '#e4fff8', name: 'Інші', values: dcAgreeTypeNames.agreementOthers }
    ]
  }
]

export const dcPromotionTableApprovedDocumentsColorsNames: DcPromotionTableColors[] = [
  {
    table: [
      { color: '#add8e6', name: 'Затверджені', values: dcAgreeTypeNames.docsApproved },
      { color: '#ffb6c1', name: 'Не затверджені', values: dcAgreeTypeNames.docsNotApproved }
    ]
  }
]
