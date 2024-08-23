import { Component, inject, OnInit } from '@angular/core';
import { PostUkrHttpService } from '../../postukr-http.service';
import { WebSocketSubject } from 'rxjs/webSocket';
import { HttpParams } from '@angular/common/http';
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'apps/verdict-front/src/app/core/services/auth.service';
import { SenderResponse } from 'apps/verdict-front/src/app/data-models/server-data.model';
import { MessageHandlingService } from 'apps/verdict-front/src/app/shared/services/message-handling.service';

@Component({
  selector: 'app-post-reestr',
  templateUrl: './post-reestr.component.html',
  styleUrls: ['./post-reestr.component.css'],
  standalone: true,
  imports: [FormsModule, NgIf, NgbProgressbar, CommonModule],
})
export class PostReestrComponent implements OnInit {
  private authService = inject(AuthService);
  private http = inject(PostUkrHttpService);
  private messageService = inject(MessageHandlingService);

  session_id = String(this.authService.loadedUser?.username);

  address_in_work: any;

  description: boolean = false;

  checkboxFirst: boolean = false;
  claim: boolean = false;

  delReestr: string = '';

  delReestrArray: string[] = [];
  sender: string = '';

  full_table: any;

  isdisabled: boolean = true;

  reestr: string = '';

  upload_File: File | undefined;

  userFile: string = '';

  upload_object = {};

  canUpload: boolean = true;

  displayFileName: string = '';

  displayinfo: string = '';

  displayinfoAboutreestr: string = '';

  connection?: WebSocketSubject<string>;

  checked: boolean = false;

  index: number = 0;
  selectedOption: string;
  fileError: string = '';
  senders: string[] = [];

  ngOnInit(): void {
    this.check();
    this.loadSenders();
  }
  loadSenders() {
    this.http.getSenders().subscribe({
      next: (response: SenderResponse) => {
        this.senders = response.senders;
      },
      error: (error) => {
        console.error('Ошибка при загрузке отправителей:', error);
      },
    });
  }
  check() {
    this.canUpload = true;

    this.connection = this.http.wsInfoAboutReestr(this.session_id);
    this.connection?.subscribe({
      next: (info) => {
        this.isdisabled = true;
        this.address_in_work = info;

        if (Object.keys(this.address_in_work).length === 0) {
          // Объект пустой
          this.connection?.unsubscribe();
          return;
        }

        if (this.address_in_work) {
          this.displayFileName = this.address_in_work.filename;
          this.displayinfo = this.address_in_work.shipment_info;
          this.displayinfoAboutreestr = this.address_in_work.register_info;

          if (this.index === 1) {
            this.isdisabled = true;
          }

          if (this.address_in_work.progress >= 100) {
            this.canUpload = false;
            this.connection?.unsubscribe();
          }

          this.displayFileName = this.address_in_work.filename;
        }

        if (!this.address_in_work || this.address_in_work.progress >= 100) {
          // Если address_in_work равен null или progress >= 100, отключить сокет
          this.connection?.unsubscribe();
        }
      },
      error: (err) => {
        this.messageService.sendError(`Втарчено зв'язок із сервером: ${err}`);
        this.connection?.unsubscribe();
        this.connection = this.http.wsInfoAboutAddress(this.session_id);
      },
      complete: async () => {
        this.connection?.unsubscribe();
        this.index === 0;
      },
    });
  }

  upload_address() {
    if (this.http.uploadFilesReestr) {
      const formData: any = new FormData();
      formData.append('file', this.http.uploadFilesReestr);
      const params = new HttpParams()
        .set('username', this.session_id)
        .set('register_name', this.reestr)
        .set('descript', this.description)
        .set('sender', this.selectedOption)
        .set('claim', this.claim);

      this.http.registerCheck(formData, params).subscribe({
        next: (data) => this.messageService.sendInfo(data.description),
        error: (err) =>
          this.messageService.sendError(`${err.status}: ${err.error.detail}`),
        complete: async () => {
          this.check();
          this.index++;
        },
      });
    }
  }

  onFileSelected(event: any) {
    this.fileError = ''; // Сбрасываем предыдущее сообщение об ошибке

    const selectedFile = event.target.files[0];

    if (selectedFile) {
      if (selectedFile.name.endsWith('.xlsx')) {
        this.http.uploadFilesReestr = this.upload_File = selectedFile;

        this.userFile = selectedFile.name;
        // Здесь вы можете выполнить дополнительные действия с файлом .xlsx
        this.isdisabled = false;
      } else {
        this.fileError = 'Обраний файл не має формат .xlsx';
        event.target.value = ''; // Сбрасываем выбранный файл

        this.userFile = '';

        this.http.uploadFilesReestr = this.upload_File = undefined;

        this.isdisabled = true;
      }
    } else {
      this.isdisabled = true;
    }
  }

  splitInputText() {
    const names = this.delReestr.split(',');
    this.delReestrArray = names;
  }

  deleteReestrGroup() {
    const group = {
      groups: this.delReestrArray,
      test_server: false,
    };
    let info: any = {};
    this.http.deleteReestr(group).subscribe({
      next: (data) => (info = data),
      complete: async () => {
        if (info.info === 'Реєстри видалено') {
          this.messageService.sendInfo(info.info);
        } else {
          this.messageService.sendError(info.info);
        }
      },
    });
  }

  createReestrGroup() {
    const group = {
      reg_name: 'Doge',
      ship_type: 'STANDARD',
      test_server: true,
    };
    this.http.createRegisterButton(group).subscribe({
      next: () => {},
      complete: async () => {
        this.messageService.sendInfo('Реестр: ' + 'Doge' + ' Cтворений');
      },
    });
  }
}
