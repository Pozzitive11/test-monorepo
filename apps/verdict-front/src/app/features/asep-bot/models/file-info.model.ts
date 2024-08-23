export interface FileInfoModel {
  Filename: string
  Filetype: string
  Status: 'Завантажено' | 'В обробці' | 'Оброблено'
  Percent: number
  PercentList: number[]
  SecondsLeft: number
  Warnings: string[]
  Errors: string[]
  ProcessingStages: string[]
}

export const isFileInfoModel = (val: any): val is FileInfoModel => {
  return (
    typeof val.Filename === 'string' &&
    typeof val.Filetype === 'string' &&
    typeof val.Percent === 'number' &&
    typeof val.SecondsLeft === 'number'
  )
}
