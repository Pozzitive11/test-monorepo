import { Component, inject, OnInit } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { PostUkrHttpService } from './postukr-http.service';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { MessageHandlingService } from '../../shared/services/message-handling.service';

@Component({
  selector: 'app-postukr',
  templateUrl: './postukr.component.html',
  styleUrls: ['./postukr.component.css'],
  standalone: true,
  imports: [NgIf],
})
export class PostukrComponent implements OnInit {
  private authService = inject(AuthService);
  private http = inject(PostUkrHttpService);
  private messageService = inject(MessageHandlingService);

  session_id = String(this.authService.loadedUser?.username);

  address_in_work?: any;

  selectedFile: any;

  load: number = 0;

  isdisabled: boolean = true;

  upload_File: File | undefined;

  userFile: string = '';

  upload_object = {};

  canUpload: boolean = true;

  displayFileName: string = '';

  displayinfo: string = '';

  connection?: WebSocketSubject<string>;
  progressPercentage: number = 0;
  fileError: string = ''; // Сообщение об ошибке

  ngOnInit(): void {
    this.check();
  }

  downloadFile() {
    this.http.downloadFileUkrpost(this.session_id, this.selectedFile.name);
  }

  check() {
    this.canUpload = true;
    this.connection?.unsubscribe();

    this.connection = this.http.wsInfoAboutAddress(this.session_id);
    this.connection?.subscribe({
      next: (info) => {
        this.load = 1;
        this.address_in_work = info;

        console.log(this.address_in_work);

        if (Object.keys(this.address_in_work).length === 0) {
          // Объект пустой
          this.connection?.unsubscribe();
          return;
        }

        this.displayFileName = this.address_in_work.filename;
        this.displayinfo = this.address_in_work.info;
        this.progressPercentage = Math.floor(this.address_in_work.progress * 1);

        if (
          this.displayinfo ===
          'Файл успішно опрацьовано. Тепер ви можете його завантажити'
        ) {
          this.connection?.unsubscribe();
          console.log('конец');
          this.canUpload = false;
          return;
        }

        this.displayFileName = this.address_in_work.filename;
      },
      error: (err) => {
        this.messageService.sendError(`Втарчено зв'язок із сервером: ${err}`);
        this.connection?.unsubscribe();
        this.connection = this.http.wsInfoAboutAddress(this.session_id);
      },
    });
  }

  upload_address() {
    this.load = 1;
    if (this.http.uploadFiles) {
      const formData: any = new FormData();
      formData.append('file', this.http.uploadFiles);
      formData.append('username', this.session_id);

      this.http.addressCheck(formData).subscribe({
        next: (data) => this.messageService.sendInfo(data.description),
        error: (err) =>
          this.messageService.sendError(`${err.status}: ${err.error.detail}`),
        complete: async () => {
          console.log('ok');
          this.check();
        },
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
