export interface IConfirmationModalComponentModel {
  title: string
  confirmText: string
  confirmButtonText: string
  cancelButtonText: string
  confirmButtonType: 'primary' | 'danger' | 'success'
  showBody: boolean
  alternativeAction: string | null
}
