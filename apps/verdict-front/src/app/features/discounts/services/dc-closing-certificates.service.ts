import { DestroyRef, effect, inject, Injectable, signal } from '@angular/core';
import { DcHttpService } from './dc-http.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, map, of, tap } from 'rxjs';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DcFillClosingCertificateTemplateData } from '../models/dc-closing-certificates';
import { saveAs } from 'file-saver';
import { MessageHandlingService } from '../../../shared/services/message-handling.service';
import { UtilFunctions } from '../../../shared/utils/util.functions';

const tableHeadersFullyClosure = [
  { name: 'НКС', key: 'ContractId' },
  { name: 'Назва проекту', key: 'ProjectName' },
  { name: 'Дата запиту', key: 'RequestDate' },
  { name: 'Запит від', key: 'RequestBy' },
  { name: 'Борг по покупці', key: 'DebtOnPurchase' },
  { name: 'Валюта', key: 'Currency' },
  { name: 'Загальна сума платежів', key: 'TotalPaymentSum' },
  { name: 'Переплата/Недоплата', key: 'OverPayment' },
];
const tableHeadersPartialClosure = [
  { name: 'НКС', key: 'ContractId' },
  { name: 'Назва проекту', key: 'ProjectName' },
  { name: 'Дата запиту', key: 'RequestDate' },
  { name: 'Запит від', key: 'RequestBy' },
  { name: 'Борг', key: 'Debt' },
  { name: 'Дата внесення', key: 'EntryDate' },
  { name: 'Гранична дата', key: 'PaymentDateLimit' },
  { name: 'Дисконт', key: 'DiscountPercent' },
  { name: 'Місяці реструктуризації', key: 'RestructuringMonths' },
  { name: 'Сума до сплати', key: 'SumToPay' },
];
@Injectable({
  providedIn: 'root',
})
export class DcClosingCertificatesService {
  private readonly httpService = inject(DcHttpService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly messageHandlingService = inject(MessageHandlingService);
  private modalService = inject(NgbModal);

  closingCertificatesInfo = signal<{ [key: string]: any }[] | null>(null);
  closingCertificatesLoader = signal(false);
  chosenDate = signal<NgbDate | null>(null);
  fromDate = signal<NgbDate | null>(null);
  toDate = signal<NgbDate | null>(null);
  checkedRows = signal<number[]>([]);
  isFullClosure = false;

  fillClosingCertificateTemplateData = signal<
    DcFillClosingCertificateTemplateData[] | null
  >(null);
  fillClosingCertificateTemplateDataLoader = signal(false);
  changedClosingCertificateTemplates = signal<
    DcFillClosingCertificateTemplateData[] | null
  >(null);

  buildedTemplate = signal<{ file: Blob; filename: string } | null>(null);
  buildedTemplateLoader = signal(false);
  tableHeaders = signal<{ name: string; key: string }[]>([]);
  templatesToDB = signal<{ file: Blob; filename: string }[]>([]);
  templatesToDBLoader = signal(false);
  step = signal(1);
  formateDate() {
    return {
      minDate: UtilFunctions.formatNgbDate(this.fromDate()),
      maxDate: UtilFunctions.formatNgbDate(this.toDate()),
    };
  }

  setTableHeaders() {
    this.tableHeaders.set(
      this.isFullClosure ? tableHeadersFullyClosure : tableHeadersPartialClosure
    );
  }
  getClosingCertificatesInfo() {
    this.closingCertificatesLoader.set(true);
    this.closingCertificatesInfo.set(null);
    this.setTableHeaders();
    this.httpService
      .searchClosingCertificates(this.isFullClosure, this.formateDate())
      .pipe(
        catchError((error) => {
          this.messageHandlingService.sendError(error.error.detail);
          this.closingCertificatesLoader.set(false);
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data) => {
        if (data) {
          this.closingCertificatesInfo.set(data);
          this.closingCertificatesLoader.set(false);
        }
      });
  }

  getFillClosingCertificateTemplateData() {
    this.fillClosingCertificateTemplateData.set(null);
    this.fillClosingCertificateTemplateDataLoader.set(true);
    this.httpService
      .fillClosingCertificateTemplateData(this.checkedRows())
      .pipe(
        map((data) => {
          return data.map((item) => ({ ...item, confirmed: false }));
        }),
        catchError((error) => {
          this.messageHandlingService.sendError(error.error.detail);
          this.fillClosingCertificateTemplateDataLoader.set(false);
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data) => {
        if (data) {
          this.fillClosingCertificateTemplateData.set(data);
          this.fillClosingCertificateTemplateDataLoader.set(false);
        }
      });
  }

  buildTemplate(
    dataForBuild: DcFillClosingCertificateTemplateData,
    saveToDB: boolean
  ) {
    if (!saveToDB) {
      this.buildedTemplateLoader.set(true);
      this.buildedTemplate.set(null);
    }
    if (saveToDB) {
      this.templatesToDBLoader.set(true);
    }
    this.httpService
      .buildClosingCertificateTemplate(dataForBuild)
      .pipe(
        catchError((error) => {
          if (saveToDB) {
            this.messageHandlingService.sendError(
              'Не вдалося побудувати шаблон для збереження'
            );
            this.templatesToDBLoader.set(false);
          } else {
            this.messageHandlingService.sendError(
              'Не вдалося побудувати шаблон'
            );
            this.buildedTemplate.set(null);
            this.buildedTemplateLoader.set(false);
          }
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data) => {
        if (data) {
          const parsedFile = UtilFunctions.fileFromHttpToBlob(data, true);
          const filename = parsedFile[1] || '';
          if (filename) {
            this.setFileBlobName(dataForBuild, filename);
          }
          if (saveToDB) {
            this.updateAndSaveTemplatesIfReady(parsedFile[0], filename);
          } else {
            this.buildedTemplate.set({
              file: parsedFile[0],
              filename: filename,
            });
            this.buildedTemplateLoader.set(false);
          }
        }
      });
  }
  updateAndSaveTemplatesIfReady(parsedFile: Blob, filename: string) {
    this.templatesToDB.update((item) => {
      if (item) {
        return [...item, { file: parsedFile, filename: filename }];
      }
      return [{ file: parsedFile, filename: filename }];
    });
    if (
      this.templatesToDB().length ===
        this.fillClosingCertificateTemplateData()?.length &&
      this.isEveryBlobName(this.fillClosingCertificateTemplateData() || [])
    ) {
      this.saveTemplatesToDB();
    }
  }

  changeDateRange(dates: { fromDate: NgbDate | null; toDate: NgbDate | null }) {
    this.fromDate.set(dates.fromDate);
    this.toDate.set(dates.toDate);
  }

  closingCertificateTemplateToDB() {
    this.templatesToDB.set([]);
    this.deleteConfirmedValue();
    const fillClosingCertificateTemplateData =
      this.fillClosingCertificateTemplateData();
    fillClosingCertificateTemplateData?.forEach((data, index) => {
      setTimeout(() => this.buildTemplate(data, true), index * 1000);
    });
  }

  saveTemplatesToDB() {
    const saveTemplates$ = this.httpService.closingCertificateTemplateToDB(
      this.fillClosingCertificateTemplateData() || []
    );

    const downloadTemplates$ =
      this.templatesToDB().length ===
      this.fillClosingCertificateTemplateData()?.length
        ? this.httpService.downloadCertificateTemplates(this.templatesToDB())
        : of(null);

    forkJoin([saveTemplates$, downloadTemplates$])
      .pipe(
        catchError((error) => {
          this.messageHandlingService.sendError('Не вдалося зерегти дані');
          this.templatesToDBLoader.set(false);
          return of();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(([res, fileRes]) => {
        if (res && fileRes) {
          this.messageHandlingService.sendInfo(res?.description);
          this.modalService.dismissAll();
          this.templatesToDBLoader.set(false);
          this.step.set(1);
          if (this.templatesToDB().length > 1) {
            UtilFunctions.saveFileFromHttp(fileRes, true);
          } else {
            saveAs(
              this.templatesToDB()[0].file,
              this.templatesToDB()[0].filename
            );
          }
          this.templatesToDB.set([]);
        }
      });
  }

  setFileBlobName(
    certificate: DcFillClosingCertificateTemplateData,
    filename: string
  ) {
    this.fillClosingCertificateTemplateData.update((item) => {
      item?.forEach((element) => {
        if (element.CertificateRequestId === certificate.CertificateRequestId) {
          element.fileBlobName = filename;
        }
      });
      return item;
    });
  }

  deleteConfirmedValue() {
    this.fillClosingCertificateTemplateData.update((data) => {
      if (data) {
        return data.map((prom) => {
          const { confirmed, ...rest } = prom;
          return rest;
        });
      }
      return null;
    });
  }

  changeConfirmOfTemplates(confirm: boolean) {
    this.fillClosingCertificateTemplateData.update((data) => {
      data?.forEach((obj) => (obj.confirmed = confirm));
      return data;
    });
  }
  isEveryConfirmed(data: DcFillClosingCertificateTemplateData[]) {
    if (!data) {
      return false;
    }
    return data.every((obj) => {
      return obj.confirmed === true;
    });
  }

  isEveryBlobName(data: DcFillClosingCertificateTemplateData[]) {
    if (!data) {
      return false;
    }
    return data.every((obj) => {
      return obj.fileBlobName !== null && obj.fileBlobName.length > 0;
    });
  }
}
