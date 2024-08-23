import { Component, inject } from '@angular/core'
import { FormsModule, NgForm } from '@angular/forms'
import { AuthService } from '../../../core/services/auth.service'
import { Router } from '@angular/router'
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { NgIf } from '@angular/common'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  standalone: true,
  imports: [NgIf, NgbProgressbar, FormsModule]
})
export class AuthComponent {
  loading = false
  error: string | null = null
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)

  onLogin(form: NgForm) {
    if (!form.valid) {
      form.reset()
      return
    }

    const formData = new FormData()
    formData.append('username', form.value.username)
    formData.append('password', form.value.password)

    this.loading = true
    this.authService.logIn(formData).subscribe({
      next: () => {
        this.error = null
        this.router.navigate([this.router.url]).then(() => (this.loading = false))
      },
      error: (error) => {
        this.error = `Login failed! ${error.error.detail}`
        this.loading = false
      }
    })

    form.reset()
  }
}
