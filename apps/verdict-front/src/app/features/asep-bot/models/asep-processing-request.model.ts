export interface AsepProcessingRequestModel {
  filename: string
  session_id?: string
  files_num: number
  vp_docs?: string[]
  URD_only: boolean
  URD_inn: boolean
  URD_fio: boolean
  FolderPath: string
}
