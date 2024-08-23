import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms'

export const matchPasswords: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  // Перевіряємо, чи control є FormGroup
  if (control && control instanceof FormGroup) {
    const password = control.get('password')?.value
    const confirmPassword = control.get('confirmPassword')?.value
    // Перевіряємо, чи паролі співпадають
    return password && confirmPassword && password === confirmPassword ? null : { notMatching: true }
  }
  return null // Якщо control не є FormGroup, повертаємо null, оскільки валідатор не може бути застосований
}
