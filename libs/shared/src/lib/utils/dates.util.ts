export const daysDifference = (startDate: Date | null, endDate: Date | null) => {
  if (!endDate || !startDate)
    return 0

  const daysPassed = Math.abs(startDate.valueOf() - endDate.valueOf())

  return Math.floor(
    (daysPassed > 0 ? daysPassed : 0) / (1000 * 60 * 60 * 24)
  )
}

export const dateFromString = (value: string, isDefault: boolean = false, format: string | null = null): Date | null => {
  if (isDefault)
    return new Date(value)

  if (format) {
    // format example: '%d.%m.%Y'; '%Y-%m-%d'; '%d/%m/%Y'; '%d-%m-%Y'
    const dateArray = value.split(/\D/)
    const formatArray = format.split(/[^dmY%]/)
    const date = new Date()

    for (let i = 0; i < formatArray.length; i++) {
      if (formatArray[i] === '%d')
        date.setDate(+dateArray[i])
      else if (formatArray[i] === '%m')
        date.setMonth(+dateArray[i] - 1)
      else if (formatArray[i] === '%Y')
        date.setFullYear(+dateArray[i])
    }

    return date
  }

  const unknownSeparatorIndex = value.search(/[^\d./-]/)
  if (unknownSeparatorIndex > 0)
    value = value.substring(0, unknownSeparatorIndex)

  for (let separator of ['.', '/', '-']) {
    const valueArray = value.split(separator)
    if (valueArray.length === 1)
      continue

    if (valueArray.length !== 3)
      return new Date(value)

    if (valueArray[0].length > 2)
      return new Date(`${valueArray[0]}-${valueArray[1]}-${valueArray[2]}`)
    else
      return new Date(`${valueArray[2]}-${valueArray[1]}-${valueArray[0]}`)
  }
  return null
}

export const periodFromDate = (date: Date): string => {
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return `${month > 9 ? month : '0' + month}.${year}`
}

export const getPeriodsBetweenDates = (minPeriod: Date, maxPeriod: Date): string[] => {
  const periods: string[] = []

  const minYear = minPeriod.getFullYear()
  const minMonth = minPeriod.getMonth()
  const maxYear = maxPeriod.getFullYear()
  const maxMonth = maxPeriod.getMonth()

  for (let year = minYear; year <= maxYear; year++) {
    const startMonth = year === minYear ? minMonth : 0
    const endMonth = year === maxYear ? maxMonth : 11

    for (let month = startMonth; month <= endMonth; month++) {
      if (month < 9)
        periods.push(`0${month + 1}.${year}`)
      else
        periods.push(`${month + 1}.${year}`)
    }
  }

  return periods
}

export const lastDayOfCurrentMonth = (): Date => {
  const date = new Date()
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

