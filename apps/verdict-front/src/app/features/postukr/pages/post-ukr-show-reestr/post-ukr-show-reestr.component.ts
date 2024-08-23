import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PostUkrHttpService } from '../../postukr-http.service';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'apps/verdict-front/src/app/core/services/auth.service';
import { MessageHandlingService } from 'apps/verdict-front/src/app/shared/services/message-handling.service';

@Component({
  selector: 'app-post-ukr-show-reestr',
  templateUrl: './post-ukr-show-reestr.component.html',
  styleUrls: ['./post-ukr-show-reestr.component.css'],
  standalone: true,
  imports: [FormsModule, NgxExtendedPdfViewerModule],
})
export class PostUkrShowReestrComponent {
  private sanitizer = inject(DomSanitizer);
  private http = inject(PostUkrHttpService);
  private messageService = inject(MessageHandlingService);
  private authService = inject(AuthService);

  @ViewChild('pdfViewer') pdfViewer: ElementRef | undefined;

  reestr?: string;
  session_id = String(this.authService.loadedUser?.username);
  pdfData: any;
  pdfUrl: SafeResourceUrl | null = null;
  srcs?: SafeResourceUrl;

  viewRegister() {
    if (this.reestr != '') {
      const group = {
        reg_name: this.reestr,
        ship_type: 'STANDARD',
        test_server: false,
      };

      this.http.tableFullRegister(group).subscribe(
        (info: ArrayBuffer) => {
          this.pdfData = new Uint8Array(info);
          const blob = new Blob([this.pdfData], { type: 'application/pdf' });
          this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            URL.createObjectURL(blob)
          );
        },
        (error) => {
          console.error('Ошибка при получении PDF: ', error);
        }
      );
    } else {
      this.messageService.sendError('Поле реєстру не має бути пустим');
    }
  }

  ngOnDestroy() {
    if (this.pdfUrl) {
      URL.revokeObjectURL(this.pdfUrl.toString()); // Освобождаем ресурсы URL при уничтожении компонента
    }
  }
}
