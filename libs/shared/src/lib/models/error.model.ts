export interface ErrorModel {
  error: {
    detail: string
  }
}

export interface AsyncErrorModel {
  error: {
    text: () => Promise<string>
  }
}

export const isAsyncErrorModel = (error: any): error is AsyncErrorModel => {
  return error.error && error.error.text
}
