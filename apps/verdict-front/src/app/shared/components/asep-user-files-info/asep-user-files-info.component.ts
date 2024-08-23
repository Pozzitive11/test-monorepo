import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core'
import { FileInfoModel } from '../../../features/asep-bot/models/file-info.model'
import { AsepUserFilesInfoService } from './asep-user-files-info.service'
import { Router } from '@angular/router'
import { NgbModal, NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { WebSocketSubject } from 'rxjs/webSocket'
import { WebSocketCommandModel } from '../../models/web-socket-command.model'
import { Subscription } from 'rxjs'
import { DecimalPipe, NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'asep-user-files-info',
  templateUrl: './asep-user-files-info.component.html',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    NgbProgressbar,
    DecimalPipe
  ]
})
export class AsepUserFilesInfoComponent implements OnInit, OnDestroy {
  readonly fileStatuses = {
    uploaded: 'Завантажено',
    inProgress: 'В обробці',
    processed: 'Оброблено'
  }
  filenameToDelete?: string
  @Input() open: boolean = false
  @Input() main: boolean = false
  @Output() navigatedAway = new EventEmitter<void>()

  connection?: WebSocketSubject<string | WebSocketCommandModel>
  filesInProgress$?: Subscription
  infoGetters: ReturnType<typeof setInterval>[] = []

  constructor(
    private asepUserFilesService: AsepUserFilesInfoService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  get loading(): boolean {
    return this.asepUserFilesService.loading
  }

  get asepUserFiles(): FileInfoModel[] {
    return this.asepUserFilesService.asepUserFiles
  }

  ngOnInit(): void {
    this.asepUserFilesService.update()

    this.connection = this.asepUserFilesService.wsConnect()
    this.connection?.subscribe({
      next: (info: string | WebSocketCommandModel) => {
        if (typeof info === 'string') {
          this.asepUserFilesService.updateFile(JSON.parse(info))
        }
      }
    })

    this.filesInProgress$ = this.asepUserFilesService.filesInProgress
      .subscribe(filesInProgress => {
        this.infoGetters.forEach(ig => clearInterval(ig))
        this.infoGetters = filesInProgress.map(file => this.setTimerForInfoGetter(file))
      })
  }

  ngOnDestroy() {
    this.connection?.unsubscribe()
    this.filesInProgress$?.unsubscribe()
    this.infoGetters.forEach(ig => clearInterval(ig))
  }

  setTimerForInfoGetter(filename: string) {
    return setInterval(() => {
      this.connection?.next({ command: this.asepUserFilesService.commands.getInfo, filename })
    }, 500)
  }

  confirmDelete(content: TemplateRef<any>, filenameToDelete: string) {
    this.filenameToDelete = filenameToDelete
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      () => this.filenameToDelete ? this.delete(this.filenameToDelete) : null,
      () => this.filenameToDelete = undefined
    )
  }

  calculateLeftTime(secondsLeft: number) {
    const div = (val: number, by: number) => (val - val % by) / by

    const hours = div(secondsLeft, 3600)
    const minutes = div(secondsLeft - hours * 3600, 60)
    const seconds = div(secondsLeft - hours * 3600 - minutes * 60, 60)

    return `${hours}:` + `${minutes > 9 ? '' : '0'}${minutes}:` + `${seconds > 9 ? '' : '0'}${seconds}`
  }

  download(filename: string) {
    this.asepUserFilesService.downloadFile(filename)
  }

  async navigateToFileProcessing(filename: string) {
    await this.router.navigate(['asep_bot', 'uploaded', filename])
    this.navigatedAway.emit()
  }

  delete(filename: string) {
    this.asepUserFilesService.deleteFile(filename)
  }

  stopProcessing(filename: string) {
    this.asepUserFilesService.stopProcessingFile(filename)
  }
}
