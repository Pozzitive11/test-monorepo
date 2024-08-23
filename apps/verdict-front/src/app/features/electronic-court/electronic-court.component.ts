import { Component, inject, OnInit } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { ElectronicCourtHttpService } from './electronic-court-http.service';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { MessageHandlingService } from '../../shared/services/message-handling.service';

@Component({
  selector: 'app-electronic-court',
  templateUrl: './electronic-court.component.html',
  styleUrls: ['./electronic-court.component.css'],
  standalone: true,
  imports: [NgIf],
})
export class ElectronicCourtComponent implements OnInit {
  private authService = inject(AuthService);
  private http = inject(ElectronicCourtHttpService);
  private messageService = inject(MessageHandlingService);

  session_id = String(this.authService.loadedUser?.username);

  address_in_work?: any;

  selectedFile: any;

  load: number = 1;

  isdisabled: boolean = true;

  upload_File: File | undefined;

  userFile: string = '';

  upload_object = {};

  canUpload: boolean = true;

  displayFileName: string = '';

  displayinfo: string = '';

  progressPercentage: number = 0;

  connection?: WebSocketSubject<string>;
  fileInfo: any;

  ngOnInit(): void {
    this.check();
  }

  downloadFile() {
    this.http.downloadFile_electronic_court(
      this.session_id,
      this.selectedFile.name
    );
  }

  downloadFiles() {
    this.http.downloadFile_electronic_court_error(
      this.session_id,
      this.selectedFile.name
    );
  }

  check() {
    this.canUpload = true;
    this.connection?.unsubscribe();

    this.connection = this.http.wsInfoAboutAdress(this.session_id);
    this.connection?.subscribe({
      next: (info) => {
        this.load = 1;
        this.address_in_work = info;

        if (Object.keys(this.address_in_work).length === 0) {
          // Объект пустой
          this.connection?.unsubscribe();
          return;
        }

        this.displayFileName = this.address_in_work.filename;
        this.displayinfo = this.address_in_work.info;
        this.progressPercentage = Math.floor(this.address_in_work.progress * 1);
        this.selectedFile = {
          ...this.selectedFile,
          name: this.address_in_work.filename,
        };
        if (
          this.displayinfo === 'File with claims id were create successfully'
        ) {
          this.connection?.unsubscribe();
          this.canUpload = false;
          return;
        }

        this.displayFileName = this.address_in_work.filename;
      },
      error: (err) => {
        this.messageService.sendError(`Втарчено зв'язок із сервером: ${err}`);
        this.connection?.unsubscribe();
        this.connection = this.http.wsInfoAboutAdress(this.session_id);
      },
    });
  }

  fileError: string = ''; // Сообщение об ошибке

  uploadAddress() {
    this.load = 1;
    if (this.http.uploadFiles) {
      const formData: any = new FormData();
      formData.append('file', this.http.uploadFiles);
      formData.append('username', this.session_id);

      this.http.Address_check(formData).subscribe({
        next: (data) => this.messageService.sendInfo(data.description),
        error: (err) =>
          this.messageService.sendError(`${err.status}: ${err.error.detail}`),
        complete: () => this.check(),
      });
    }
  }

  onFileSelected(event: any) {
    this.fileError = ''; // Сбрасываем предыдущее сообщение об ошибке

    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      if (this.selectedFile.name.endsWith('.xlsx')) {
        console.log('Выбран файл с расширением .xlsx:', this.selectedFile.name);

        this.http.uploadFiles = this.upload_File = this.selectedFile;

        this.userFile = this.selectedFile.name;
        // Здесь вы можете выполнить дополнительные действия с файлом .xlsx

        this.isdisabled = false;
      } else {
        this.fileError = 'Обраний файл не має формат .xlsx';
        event.target.value = ''; // Сбрасываем выбранный файл

        this.userFile = '';

        this.http.uploadFiles = this.upload_File = undefined;

        this.isdisabled = true;
      }
    } else {
      this.isdisabled = true;
    }
  }
}
