import { TRow, TTable } from '../../../models/basic-types'

export const interfaceDataToObjectsFunction = async (data: any[], aliases: string[]): Promise<TTable> => {
  const objData: TTable = []

  data.forEach(row => {
    const objModel: TRow = {}
    Object.keys(row).forEach((key, index) => {
      objModel[aliases[index] || key] = row[key]
    })
    objData.push(objModel)
  })

  return objData
}
