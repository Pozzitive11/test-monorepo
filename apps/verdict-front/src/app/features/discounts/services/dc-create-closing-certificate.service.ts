import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { DcHttpService } from './dc-http.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import {
  DcClosingCertificate,
  DcClosingCertificateDetails,
  DcClosingCertificateToSave,
} from '../models/dc-create-closing-certificate.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageHandlingService } from '../../../shared/services/message-handling.service';

@Injectable({
  providedIn: 'root',
})
export class DcCreateClosingCertificateService {
  private readonly httpService = inject(DcHttpService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly messageHandlingService = inject(MessageHandlingService);
  private modalService = inject(NgbModal);

  closingCertificateInfo = signal<DcClosingCertificate | null>(null);
  closingCertificateDetails = signal<DcClosingCertificateDetails | null>(null);
  sendingWays = signal<{ id: number; Name: string }[] | null>(null);
  closingCertificateError = signal('');
  closingCertificateLoading = signal(false);

  emailAddress = signal('');
  sendingAddress = signal('');
  docsFields = signal<{ MethodId: number; AddressDetails: string }[]>([]);
  isEmailSelected = signal(false);

  getSendingWays() {
    this.httpService
      .getSendingWays()
      .pipe(
        catchError((error) => {
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data) => {
        if (data) {
          this.sendingWays.set(data);
        }
      });
  }

  getClosingCertificateInitialInfo(contractId: number) {
    this.closingCertificateInfo.set(null);
    this.closingCertificateLoading.set(true);
    this.closingCertificateError.set('');
    this.httpService
      .getClosingCertificateInitialInfo(contractId)
      .pipe(
        catchError((error) => {
          this.closingCertificateError.set(error.error.detail);
          this.closingCertificateLoading.set(false);
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data) => {
        if (data) {
          this.closingCertificateLoading.set(false);
          this.closingCertificateInfo.set(data);
          this.closingCertificateDetails.set(data.LastAgreedPromotion);
        }
      });
  }

  changeSendingWays(path: { id: number; Name: string }) {
    const index = this.docsFields()?.findIndex(
      (doc) => doc.MethodId === path.id
    );

    if (index === -1) {
      const newDocField = {
        MethodId: path.id,
        AddressDetails:
          path.id === 652721 ? this.emailAddress() : this.sendingAddress(),
      };
      this.docsFields.set([...this.docsFields(), newDocField]);
    } else {
      const updatedDocsFields = [...this.docsFields()];
      updatedDocsFields.splice(index, 1);
      this.docsFields.set(updatedDocsFields);
    }
    this.isEmail();
  }

  isEmail() {
    const docsFields = this.docsFields();
    this.isEmailSelected.set(
      docsFields?.some((doc) => doc.MethodId === 652721)
    );
  }

  isChecked(path: { id: number; Name: string }): boolean {
    return this.docsFields()?.some((doc) => doc.MethodId === path.id);
  }

  changeSendingAddress() {
    const updatedDocsFields = this.docsFields()?.map((doc) => {
      if (doc.MethodId !== 652721) {
        return { ...doc, AddressDetails: this.sendingAddress() };
      }
      return doc;
    });
    this.docsFields.set(updatedDocsFields);
  }

  changeEmailAddress() {
    const updatedDocsFields = this.docsFields()?.map((doc) => {
      if (doc.MethodId === 652721) {
        return { ...doc, AddressDetails: this.emailAddress() };
      }
      return doc;
    });
    this.docsFields.set(updatedDocsFields);
  }
  createClosingCertificate(contractId: number) {
    const closingCertificateToSaveObj: DcClosingCertificateToSave = {
      IsFullClosure: this.closingCertificateInfo()?.IsFullClosure,
      ContractId: contractId,
      SendingDetails: this.docsFields(),
    };

    this.httpService
      .saveClosingCertificate(closingCertificateToSaveObj)
      .pipe(
        catchError((err) => {
          this.messageHandlingService.sendError(err.error.detail);
          this.modalService.dismissAll();
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data) => {
        if (data) {
          this.docsFields.set([]);
          this.emailAddress.set('');
          this.sendingAddress.set('');
          this.messageHandlingService.sendInfo('Договір успішно закрито');
          this.modalService.dismissAll();
        }
      });
  }
}
