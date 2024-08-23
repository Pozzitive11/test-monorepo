import { DcMilitaryDocsDataService } from './../../../services/dc-military-docs-data.service';
import { NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  NgbAccordionModule,
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbProgressbar,
} from '@ng-bootstrap/ng-bootstrap';
import { DcHttpService } from '../../../services/dc-http.service';
import { DcDataService } from '../../../services/dc-data.service';
import { FileUploadComponent } from 'apps/verdict-front/src/app/shared/components/file-upload/file-upload.component';
import { ShortTextPipe } from 'apps/verdict-front/src/app/shared/pipes/short-text.pipe';
import { MessageHandlingService } from 'apps/verdict-front/src/app/shared/services/message-handling.service';
interface Document {
  DocName: string;
  Children: { id: number; DocName: string }[];
}
@Component({
  selector: 'app-dcm-doc-upload-card',
  standalone: true,
  imports: [
    NgbAccordionModule,
    FileUploadComponent,
    ShortTextPipe,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownItem,
    NgIf,
    NgFor,
    NgbProgressbar,
  ],
  templateUrl: './dcm-doc-upload-card.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DcmDocUploadCardComponent {
  private readonly httpService = inject(DcHttpService);
  private readonly dataService = inject(DcDataService);
  protected dcMilitaryDocsDataService = inject(DcMilitaryDocsDataService);
  private readonly messageService = inject(MessageHandlingService);
  private readonly dcDataService = inject(DcDataService);
  document = input<Document>();
  isSpouse = input<boolean>(false);

  selectedFiles = signal<{ file: File; docType?: any; fileId?: number }[]>([]);
  loading = signal<boolean>(false);

  militaryDocTypes = computed(() => {
    if (!this.isSpouse()) {
      return this.dcMilitaryDocsDataService
        .militaryDocTypes()
        .filter((docType) => {
          return docType.id !== 652767;
        });
    }
    return this.dcMilitaryDocsDataService.militaryDocTypes();
  });

  selectFiles(fileList: FileList | null): void {
    if (fileList) {
      for (let i = 0; i < fileList.length; i++) {
        this.selectedFiles.update((files) => [...files, { file: fileList[i] }]);
      }
    }
  }

  removeFile(index: number) {
    this.selectedFiles.update((files) => files.filter((_, i) => i !== index));
  }

  uploadFiles() {
    if (this.selectedFiles) {
      const filesSent = this.selectedFiles.length;
      let filesSaved: number = 0;

      this.loading.set(true);
      for (let file of this.selectedFiles()) {
        const formData = new FormData();

        formData.append('file', file.file, file.file.name);
        this.httpService
          .uploadMilitaryDoc(
            formData,
            this.dataService.contractId,
            file.fileId || 0,
            this.isSpouse()
          )
          .subscribe({
            next: (data) => {
              this.messageService.sendInfo(data.description);
              filesSaved++;
            },
            error: (err) => {
              this.messageService.sendError(
                `${err.status}: ${err.error.detail}`
              );
              this.loading.set(false);
            },
            complete: () => {
              if (filesSaved === filesSent) {
                this.loading.set(false);
                this.dcDataService.getScoreModel();
              }
            },
          });
      }
    }
    this.selectedFiles.set([]);
  }
  canUploadMilitaryDocs(): boolean {
    return (
      this.selectedFiles().length === 0 ||
      this.selectedFiles().some((value) => !value.docType)
    );
  }
}
