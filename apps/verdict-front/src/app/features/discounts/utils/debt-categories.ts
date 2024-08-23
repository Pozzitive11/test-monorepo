export const DEBT_CATEGORIES: { [p: string]: 'contract' | 'calculated' | 'register' } = {
  'Сума боргу з 1С': 'calculated',
  'Сума боргу з реєстру-Платежі після відступлення': 'register',
  'Сума боргу з НКС': 'contract'
}

export const determineDebtType = (row: { [p: string]: any }): 'contract' | 'calculated' | 'register' => {
  let debtType: 'contract' | 'calculated' | 'register'
  if (row['Сума боргу (реєстр)'] === row['Сума боргу на момент подачі'])
    debtType = 'calculated'
  else if (row['Сума боргу на момент подачі'] < row['Сума боргу (реєстр)']) {
    if (row['Сума платежів після відступлення']) {
      if (row['Сума боргу на момент подачі'] > row['Сума боргу (реєстр)'] - row['Сума платежів після відступлення'])
        debtType = 'contract'
      else
        debtType = 'register'
    } else
      debtType = 'calculated'
  } else
    debtType = 'contract'

  return debtType
}


