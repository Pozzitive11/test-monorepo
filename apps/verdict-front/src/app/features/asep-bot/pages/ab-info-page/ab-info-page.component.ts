import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MessageHandlingService } from '../../../../shared/services/message-handling.service';
import { AbAsepBotDataService } from '../../services/ab-asep-bot-data.service';
import { AbHttpService } from '../../services/ab-http.service';
import { Router } from '@angular/router';
import { UtilFunctions } from '../../../../shared/utils/util.functions';
import { WebSocketSubject } from 'rxjs/webSocket';
import { FilesInWorkModel } from '../../models/files-in-work.model';
import { FormatDatePipe } from '../../../../shared/pipes/format-date.pipe';
import { FileUploadButtonComponent } from '../../../../shared/components/file-upload-button/file-upload-button.component';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
import { AbBotRulesComponent } from '../../components/ab-bot-rules/ab-bot-rules.component';
import { NgbProgressbar, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { AuthService } from 'apps/verdict-front/src/app/core/services/auth.service';

@Component({
  selector: 'app-ab-info-page',
  templateUrl: './ab-info-page.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgbProgressbar,
    NgbTooltip,
    AbBotRulesComponent,
    FileUploadComponent,
    NgFor,
    FileUploadButtonComponent,
    DecimalPipe,
    FormatDatePipe,
  ],
})
export class AbInfoPageComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private httpService = inject(AbHttpService);
  private messageService = inject(MessageHandlingService);
  private route = inject(Router);
  asepService = inject(AbAsepBotDataService);

  filesLoading: boolean = false;

  get fileList() {
    return this.asepService.userFiles;
  }

  get bufferInfo() {
    return this.asepService.bufferInfo;
  }

  get loading() {
    return this.asepService.loading;
  }

  set loading(value: boolean) {
    this.asepService.loading = value;
  }

  connection?: WebSocketSubject<string>;
  filesInWorkInfo?: FilesInWorkModel;

  get username() {
    return this.authService.loadedUser?.username;
  }

  ngOnInit(): void {
    this.connection = this.asepService.wsFilesInWorkConnect();
    this.connection?.subscribe({
      next: (info) => (this.filesInWorkInfo = JSON.parse(info)),
      error: (err) => {
        this.messageService.sendError(`Втарчено зв'язок із сервером: ${err}`);
        this.connection?.unsubscribe();
        this.connection = this.asepService.wsFilesInWorkConnect();
      },
    });

    this.getBufferInfo(false);
  }

  ngOnDestroy(): void {
    this.connection?.unsubscribe();
  }

  onUploadFile(files: FileList | null) {
    if (files)
      for (let i = 0; i < files.length; i++)
        this.asepService.userFiles.push({ file: files[i] });
  }

  uploadFiles() {
    this.filesLoading = true;
    if (this.asepService.userFiles) {
      const formData = new FormData();
      for (let file of this.asepService.userFiles)
        formData.append('files', file.file);
      formData.append('session_id', this.username || '');

      this.httpService.uploadFile(formData).subscribe({
        next: (data) => this.messageService.sendInfo(data.description),
        error: (err) =>
          this.messageService.sendError(`${err.status}: ${err.error.detail}`),
        complete: async () => {
          this.filesLoading = false;
          this.asepService.userFiles = [];
          await this.route.navigate(['asep_bot', 'uploaded']);
        },
      });
    }
  }

  removeFile(filename: string) {
    this.asepService.userFiles = this.asepService.userFiles.filter(
      (file) => file.file.name !== filename
    );
  }

  getBufferFile() {
    this.loading = true;
    this.httpService.getBufferFile().subscribe({
      next: (file) =>
        UtilFunctions.downloadXlsx(file, 'Не оброблені з АСВП.xlsx'),
      error: async (error) => {
        this.loading = false;
        this.messageService.sendError(
          JSON.parse(await error.error.text()).detail
        );
      },
      complete: () => (this.loading = false),
    });
  }

  getBufferInfo(update: boolean) {
    this.asepService.getBufferInfo(update);
  }

  sendBufferRepairFile(files: FileList | null) {
    if (!files) return;
    if (files.length > 1) {
      this.messageService.sendError(
        'Необхідно обрати один файл. Обробка кількох файлів одночасно не підтримується'
      );
      return;
    }

    this.loading = true;
    const formData = new FormData();
    formData.append('file', files[0]);

    this.httpService.sendBufferRepairFile(formData).subscribe({
      next: (data) => {
        data.description.split('; ').forEach((item: any) => {
          item.includes('Помилка')
            ? this.messageService.sendError(item)
            : this.messageService.sendInfo(item);
        });
      },
      error: (err) => {
        this.messageService.sendError(`${err.status}: ${err.error.detail}`);
        this.loading = false;
      },
      complete: () => (this.loading = false),
    });
  }
}
