import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AbHttpService } from '../../services/ab-http.service';
import { ActivatedRoute } from '@angular/router';
import { FileChecksModel } from '../../models/file-checks.model';
import { FileInfoModel } from '../../models/file-info.model';
import { WebSocketCommandModel } from '../../../../shared/models/web-socket-command.model';
import { WebSocketSubject } from 'rxjs/webSocket';
import { AsepUserFilesInfoService } from '../../../../shared/components/asep-user-files-info/asep-user-files-info.service';
import { AsepProcessingRequestModel } from '../../models/asep-processing-request.model';
import { NgbProgressbar, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { SwitchCheckboxComponent } from '../../../../shared/components/switch-checkbox/switch-checkbox.component';
import { InputInGroupComponent } from '../../../../shared/components/input-in-group/input-in-group.component';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { AuthService } from 'apps/verdict-front/src/app/core/services/auth.service';
import { MessageHandlingService } from 'apps/verdict-front/src/app/shared/services/message-handling.service';

@Component({
  selector: 'app-ab-asep-file',
  templateUrl: './ab-asep-file.component.html',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    NgFor,
    InputInGroupComponent,
    SwitchCheckboxComponent,
    NgbTooltip,
    NgbProgressbar,
  ],
})
export class AbAsepFileComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly httpService = inject(AbHttpService);
  private readonly messageService = inject(MessageHandlingService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly asepUserFilesService = inject(AsepUserFilesInfoService);

  filename!: string;
  filesCount: number = 1;
  connection?: WebSocketSubject<string | WebSocketCommandModel>;
  vpIdChecks: FileChecksModel[] = [];
  urdFio: boolean = false;
  urdInn: boolean = true;
  urdOnly: boolean = false;
  folderPath: string = '';
  fileInfo?: FileInfoModel;
  timer?: ReturnType<typeof setInterval>;

  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      // parse url-encoded filename
      this.filename = decodeURIComponent(params['name']);
    });
  }

  get username() {
    return this.authService.loadedUser?.username;
  }

  download() {
    if (!this.username) {
      this.messageService.sendError(
        'Вхід не виконано, спробуйте перезавантажити сторінку.'
      );
      return;
    }

    this.asepUserFilesService.downloadFile(this.filename);
  }

  ngOnInit(): void {
    this.httpService.getFileChecks().subscribe({
      next: (checks) => (this.vpIdChecks = checks),
      error: (error) => this.messageService.sendError(error.error.detail),
    });

    this.asepUserFilesService.getFileInfo(this.filename)?.subscribe({
      next: (info) => (this.fileInfo = info),
      error: (error) => this.messageService.sendError(error.error.detail),
      complete: () => {
        if (this.fileInfo?.Status === 'В обробці') this.connectToWS();
      },
    });
  }

  ngOnDestroy(): void {
    this.disconnectFromWS();
  }

  connectToWS() {
    this.connection = this.asepUserFilesService.wsConnect();

    this.timer = setInterval(() => {
      this.connection?.next({
        command: this.asepUserFilesService.commands.getInfo,
        filename: this.filename,
      });
    }, 200);

    this.connection?.subscribe({
      next: (info: string | WebSocketCommandModel) => {
        if (typeof info === 'string') {
          const fileInfo: FileInfoModel = JSON.parse(info);
          if (fileInfo.Filename === this.filename) this.fileInfo = fileInfo;
        }
        if (this.fileInfo?.Status === 'Оброблено') this.disconnectFromWS();
      },
    });
  }

  disconnectFromWS() {
    clearInterval(this.timer);
    this.connection?.unsubscribe();
  }

  startASEPProcessing() {
    const asepProcessing: AsepProcessingRequestModel = {
      session_id: this.username,
      filename: this.filename,
      files_num: this.filesCount,
      vp_docs: this.vpIdChecks
        .filter((check) => check.selected)
        .map((check) => check.name),
      URD_fio: this.urdFio,
      URD_inn: this.urdInn,
      URD_only: this.urdOnly,
      FolderPath: this.folderPath,
    };

    if (this.filesCount) {
      this.httpService.startProcessing(asepProcessing).subscribe({
        next: (info) => this.messageService.sendInfo(info.description),
        error: (err) => this.messageService.sendError(err.error.detail),
        complete: () => this.connectToWS(),
      });
    } else this.messageService.sendError('Неможливо поділити файл на 0 частин');
  }

  fileTypeIsEPID() {
    return (
      this.fileInfo?.Filetype ===
      this.asepUserFilesService.filetypes.EP_NUM_PLUS_ID
    );
  }

  fileTypeIsDownloadFiles() {
    return (
      this.fileInfo?.Filetype ===
      this.asepUserFilesService.filetypes.EP_DOWNLOAD_FILES
    );
  }

  fileIsForURD() {
    return (
      this.fileInfo?.Filetype === this.asepUserFilesService.filetypes.FIO_INN ||
      this.fileInfo?.Filetype === this.asepUserFilesService.filetypes.INN_ONLY
    );
  }

  fileIsURDInn() {
    return (
      this.fileInfo?.Filetype === this.asepUserFilesService.filetypes.INN_ONLY
    );
  }

  stopProcessing() {
    this.connection?.next({
      command: this.asepUserFilesService.commands.stop,
      filename: this.filename,
    });
  }
}
