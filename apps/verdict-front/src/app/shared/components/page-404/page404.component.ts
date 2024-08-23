import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { environment } from '../../../../environments/environment'
import { webSocket, WebSocketSubject } from 'rxjs/webSocket'
import { AuthService } from '../../../core/services/auth.service'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'

@Component({
  selector: 'app-page-404',
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.css'],
  standalone: true,
  imports: []
})
export class Page404Component implements OnInit, OnDestroy {
  private auth = inject(AuthService)
  private http = inject(HttpClient)
  private router = inject(Router)
  websocketLink = environment.SOCKET_ENDPOINT
  url = 'http://localhost:8050/api/v0/'
  messages: string[] = []
  connection?: WebSocketSubject<{ message: string }>

  firstDigit: number
  secondDigit: number
  thirdDigit: number
  ngOnInit(): void {
    this.startRandomNumberAnimation()
  }
  ngOnDestroy(): void {
    this.connection?.unsubscribe()
  }

  startProcess() {
    if (!this.auth.isAuthorized || !this.auth.loadedUser) return

    this.http.get(this.url + 'run_back_test/' + this.auth.loadedUser.username).subscribe({
      next: (value) => console.log(value),
      error: (err) => console.log(err)
    })
  }

  connectToSocket() {
    if (!this.auth.isAuthorized || !this.auth.loadedUser) return

    this.connection = webSocket(this.websocketLink + '/' + this.auth.loadedUser.username)
    this.connection.subscribe({
      next: (value) => {
        this.messages.push(value.message)
        console.log(value)
      },
      error: (err) => console.log(err),
      complete: () => console.log('connection ended')
    })
  }

  disconnectFromSocket() {
    this.connection?.unsubscribe()
  }

  startRandomNumberAnimation(): void {
    const time = 30
    let i = 0
    const loop3 = setInterval(() => {
      if (i > 40) {
        clearInterval(loop3)
        this.thirdDigit = 4
      } else {
        this.thirdDigit = this.randomNum()
        i++
      }
    }, time)

    const loop2 = setInterval(() => {
      if (i > 80) {
        clearInterval(loop2)
        this.secondDigit = 0
      } else {
        this.secondDigit = this.randomNum()
        i++
      }
    }, time)

    const loop1 = setInterval(() => {
      if (i > 100) {
        clearInterval(loop1)
        this.firstDigit = 4
      } else {
        this.firstDigit = this.randomNum()
        i++
      }
    }, time)
  }

  randomNum(): number {
    return Math.floor(Math.random() * 9) + 1
  }

  navigateToToHomePage() {
    this.router.navigate(['/'])
  }
}
