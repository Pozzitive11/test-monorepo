import { Component, inject, OnInit } from '@angular/core'
import { AuthService } from '../../../../core/services/auth.service'
import { MessageHandlingService } from '../../../../shared/services/message-handling.service'
import { LwHttpService } from '../../services/lw-http.service'
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component'
import { NgClass, NgFor, NgIf } from '@angular/common'


@Component({
  selector: 'app-lawyers-bot',
  templateUrl: './lawyers-bot.component.html',
  styleUrls: ['./lawyers-bot.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, FileUploadComponent, NgClass]
})
export class LawyersBotComponent implements OnInit {
  private lawService = inject(LwHttpService)
  private authService = inject(AuthService)
  private messageService = inject(MessageHandlingService)

  timer_ava: any
  timer = 1
  interval: any
  input = true

  get fileList() {
    return this.lawService.userFiles
  }

  get fileListUpload() {
    return this.lawService.uploadedUserFiles
  }

  get username() {
    return this.authService.loadedUser?.username
  }

  ngOnInit(): void {
    this.updateUserFiles()
    setTimeout(() => {this.start()}, 500)
  }

  download(filename: string) {
    this.lawService.downloadFile_bot(filename, this.username)
    clearInterval(this.interval)
  }


  start() {
    this.timer = 1
    setTimeout(() => {this.updateUserFiles()}, 500)


    let z = 0
    if (this.lawService.uploadedUserFiles.length >= 0) {
      this.timer_ava = setInterval(() => {
        {
          this.timer++
          if (this.timer === 4 || this.timer > 4) {this.timer = 1}
          console.log(this.timer)
        }
      }, 1000)
      this.interval = setInterval(() => {
        z = 0
        for (let i = 0; i < this.lawService.uploadedUserFiles.length; i++) {

          if (!this.lawService.uploadedUserFiles[i].progress) {
            this.updateUserFiles()
          }
          if (this.lawService.uploadedUserFiles[i].progress) {
            z++
            if (z === this.lawService.uploadedUserFiles.length) {
              clearInterval(this.interval)
              clearInterval(this.timer_ava)
              console.log('interval stop')
              this.timer = 0
            }
          }
        }
        if (this.timer === 4 || this.timer > 4) {
          this.timer = 1
        } else if (this.timer === 0) {
          clearInterval(this.interval)
          console.log('STOP')
        }
        console.log(this.timer)
      }, 6000)
    } else {
      clearInterval(this.interval)
      this.timer = 0
    }
  }

  onUploadFile(files: FileList | null) {
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.lawService.userFiles.push({ file: files[i] })
      }
      this.input = false
    }
  }

  removeFile(filename: string) {
    this.lawService.userFiles = this.lawService.userFiles.filter(file => file.file.name !== filename)
    this.input = true
    clearInterval(this.interval)
  }

  uploadFiles() {
    if (this.lawService.userFiles) {
      const formData: any = new FormData()
      for (let file of this.lawService.userFiles)
        formData.append('file', file.file)
      formData.append('username', this.username)

      this.lawService.uploadFile(formData)
        .subscribe({
          next: (data) => this.messageService.sendInfo(data.description),
          error: err => this.messageService.sendError(`${err.status}: ${err.error.detail}`),
          complete: async () => {
            this.lawService.userFiles = []
            console.log('ok')
          }
        })
    }
    this.input = true
  }

  deleteFile(filename: string) {
    if (!this.username) {
      return
    }
    this.lawService.deleteFile(this.username, filename)
      .subscribe({
        next: info => this.messageService.sendInfo(info.description),
        error: err => this.messageService.sendError(err.error.detail),
        complete: () => this.updateUserFiles()

      })
    clearInterval(this.interval)
  }

  updateUserFiles() {
    if (!this.username) {
      return
    }
    this.lawService.getFiles(this.username)
      .subscribe(
        (data) => {
          this.lawService.uploadedUserFiles = data
        }
      )
  }
}
