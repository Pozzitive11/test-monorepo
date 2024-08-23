import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import {
  NgbModal,
  NgbProgressbar,
  NgbTooltip,
} from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { DcHttpService } from '../../../services/dc-http.service';
import { DcPromotionsDataService } from '../../../services/dc-promotions-data.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DcSendingDocsFiltersService } from '../../../services/dc-sending-docs-filters.service';
import { DatePickerPopupComponent } from '../../../../../shared/components/date-picker-popup/date-picker-popup.component';
import { DefaultDropdownComponent } from '../../../../../shared/components/default-dropdown/default-dropdown.component';
import { FileUploadComponent } from '../../../../../shared/components/file-upload/file-upload.component';
import { NgFor, NgIf } from '@angular/common';
import { MessageHandlingService } from 'apps/verdict-front/src/app/shared/services/message-handling.service';
import { UtilFunctions } from 'apps/verdict-front/src/app/shared/utils/util.functions';
import { PaymentDocModel } from '../../../../purpose-payments/models/payment-doc.model';

@Component({
  selector: 'dc-upload-docs-cell',
  templateUrl: './dc-upload-docs-cell.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgbProgressbar,
    NgFor,
    FileUploadComponent,
    DefaultDropdownComponent,
    NgbTooltip,
    DatePickerPopupComponent,
  ],
})
export class DcUploadDocsCellComponent implements OnInit, OnChanges {
  private readonly sendingDocsFiltersService = inject(
    DcSendingDocsFiltersService
  );
  private readonly httpService = inject(DcHttpService);
  private readonly messageService = inject(MessageHandlingService);
  private readonly modalService = inject(NgbModal);
  private readonly destroyRef = inject(DestroyRef);
  readonly dataService = inject(DcPromotionsDataService);
  readonly PAYMENT_DOC_TYPES = ['ТТН'];

  @Input() value: PaymentDocModel[] = [];
  @Input() pib = '';
  @Input() selectedRowsIds: number[] = [];
  @Input() isElectrPoshta = false;
  @Input() cp_id = 0;
  @Input() row!: { [key: string]: any };
  @Output() valueChange = new EventEmitter<PaymentDocModel[]>();

  selectedApplications: { [key: string]: any }[] = [];
  valueInEdit: PaymentDocModel[] = [];
  oldValueHandler: PaymentDocModel[] = [];
  newLoadedDocs: { file: File; docType: string }[] = [];

  ngOnInit(): void {
    this.sendingDocsFiltersService
      .getFilteredApplications()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((selectedApplications) => {
        this.selectedApplications = selectedApplications;
      });
  }

  get formattedDate() {
    return UtilFunctions.formatNgbDate(this.dataService.chosenDate, '%Y-%m-%d');
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.valueInEdit = this.value.map((doc) => ({ ...doc }));
  }

  openModal(content: TemplateRef<any>) {
    this.oldValueHandler = this.valueInEdit.map((doc) => ({ ...doc }));

    this.modalService.open(content, { centered: true, size: 'lg' }).result.then(
      () => {
        this.value = this.valueInEdit.map((doc) => ({ ...doc }));
        this.valueChange.emit(this.value);
      },
      () => {
        if (this.oldValueHandler.length)
          this.valueInEdit = this.oldValueHandler.map((doc) => ({ ...doc }));
        this.oldValueHandler = [];
      }
    );
  }

  addFiles(newFiles: FileList | null) {
    if (newFiles) {
      for (let i = 0; i < newFiles.length; i++) {
        this.newLoadedDocs.push({ file: newFiles[i], docType: '' });
      }
    }
  }

  filterSelectedApplications(): any[] {
    return this.selectedApplications.filter((selectedApplication) =>
      this.selectedRowsIds.includes(selectedApplication['id'])
    );
  }

  uploadFiles() {
    this.selectedRowsIds.push(this.cp_id);
    this.selectedApplications = this.filterSelectedApplications();
    // this.selectedApplications = this.selectedApplications.filter((selectedApplication) => {
    //   return this.selectedRowsIds.includes(selectedApplication['id'])
    // })

    forkJoin(
      this.selectedApplications.map((selectedApplication) => {
        let formData: FormData | null = null;
        let docType: string = '';
        let pib: string = '';

        if (!this.isElectrPoshta) {
          docType = this.newLoadedDocs[0].docType;
          formData = new FormData();
          pib = selectedApplication['ПІБ'] || this.row['ПІБ'];
          this.newLoadedDocs.forEach((file) => {
            formData!.append('file', file.file, file.file.name);
          });
        }

        return this.httpService.uploadShippingDocs(
          pib,
          selectedApplication['id'] || this.cp_id,
          this.formattedDate,
          formData,
          docType,
          selectedApplication['Системний номер договору']
        );
      })
    ).subscribe({
      next: (uploadedDocsArray) => {
        this.messageService.sendInfo('Документи успішно завантажено');

        uploadedDocsArray.forEach((uploadedDocs, index) => {
          this.value.push(...uploadedDocs);
          this.valueInEdit = this.value.map((doc) => ({ ...doc }));
          this.valueChange.emit(this.value);
          this.oldValueHandler = [];
          this.newLoadedDocs = [];
        });
      },
      error: (err) => {
        this.messageService.sendError(err.error.detail);
      },
      complete: () => {
        this.sendingDocsFiltersService
          .getFilteredApplications()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe();
        this.sendingDocsFiltersService.selectedRowIds$.next([]);
        this.updateRow();
      },
    });
  }

  updateRow() {
    const formattedDate = UtilFunctions.formatNgbDate(
      this.dataService.chosenDate,
      '%d.%m.%Y'
    );

    for (const selectedApplication of this.selectedApplications) {
      selectedApplication['Дата відправки'] = formattedDate;
    }

    if (this.row) {
      this.row['Дата відправки'] = formattedDate;
    }
    this.sendingDocsFiltersService
      .getFilteredApplications()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  canBeUploaded() {
    return this.dataService.chosenDate;
  }
}
