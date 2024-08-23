import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { BehaviorSubject, tap } from 'rxjs'
import { environment } from '../../../environments/environment'
import { AuthResponseData } from '../../data-models/server-data.model'
import { User } from '../models/user.model'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient)
  private readonly router = inject(Router)

  isAuthorized: boolean = false
  user = new BehaviorSubject<User | null>(null)
  loadedUser: User | null = null
  private readonly url: string = (environment.BACKEND_URL || window.location.origin) + environment.API_BASE_URL + environment.auth_api_url

  serverLogIn(form: FormData) {
    return this.http.post<AuthResponseData>(
      this.url + '/login',
      form
    )
  }

  checkAccess(pageInfo: { page: string; token: string }) {
    interface AccessInfo {
      access: boolean
      pageToNavigate?: string
    }

    return this.http.post<AccessInfo>(
      this.url + '/check_access',
      pageInfo
    )
  }

  logIn(form: FormData) {
    return this.serverLogIn(form)
      .pipe(
        tap((resData) => {
          this.loadedUser = new User(
            resData.id,
            resData.username,
            resData.homePage,
            resData.role,
            resData.access_token,
            resData.pages,
            resData.expiresAt
          )
          localStorage.setItem('user', JSON.stringify(this.loadedUser))
          this.isAuthorized = true
          this.user.next(this.loadedUser)
        })
      )
  }

  logOut() {
    this.isAuthorized = false
    localStorage.removeItem('user')
    this.loadedUser = null
    this.user.next(this.loadedUser)
  }

  autoLogIn(mainPage: string = '') {
    const user_data = localStorage.getItem('user')
    if (!user_data) {
      this.isAuthorized = false
      return
    }

    const user: {
      id: number,
      username: string,
      homePage: string,
      _role: string,
      _token: string,
      _pages: string[],
      _tokenExpirationDate: string
    } = JSON.parse(user_data)

    this.loadedUser = new User(
      user.id,
      user.username,
      user.homePage,
      user._role,
      user._token,
      user._pages,
      new Date(user._tokenExpirationDate)
    )

    if (this.loadedUser.token) {
      const url = mainPage ? mainPage : this.router.url
      this.checkAccess({ page: url, token: this.loadedUser.token })
        .subscribe({
          next: value => {
            this.isAuthorized = value.access
            this.user.next(this.loadedUser)
          },
          error: () => this.isAuthorized = false
        })
    } else
      this.logOut()
  }

}
