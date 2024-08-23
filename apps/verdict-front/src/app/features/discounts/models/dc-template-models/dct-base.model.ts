export interface DctBaseModel {
  fileLoaded?: boolean
  fileBlob?: Blob
  fileBlobName: string | null

  confirmed?: boolean
}

export const isDctBaseModel = (obj: any): obj is DctBaseModel => {
  return obj.fileBlobName !== undefined
}
