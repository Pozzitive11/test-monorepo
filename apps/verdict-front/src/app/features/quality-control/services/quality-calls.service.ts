import { DestroyRef, Injectable, inject } from '@angular/core';
import { Call, CallSearchParameters } from '../models/calls.model';
import { BehaviorSubject, catchError, from, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { QualityHttpService } from './quality-http.service';
import { QualityCallsCallService } from './quality-calls-call.service';
import { MessageHandlingService } from '../../../shared/services/message-handling.service';

@Injectable({
  providedIn: 'root',
})
export class QualityCallsService {
  private qualityHttpService = inject(QualityHttpService);
  private qualityCallsCallService = inject(QualityCallsCallService);
  private destroyRef = inject(DestroyRef);
  private messageService = inject(MessageHandlingService);

  private _callsList$ = new BehaviorSubject<Call[]>([]);
  callsList$ = from(this._callsList$);
  private _isCallsLoaded$ = new BehaviorSubject<boolean>(false);
  isCallsLoaded$ = from(this._isCallsLoaded$);

  private inputFilters: { [key: string]: string } = {};

  vrIDInput = '';
  callTypeInput = '';
  contractIdInput = '';
  loginInput = '';
  startTimeInput = '';
  durationInput = '';
  phoneNumberInput = '';

  callListLoader = false;

  callList: Call[] = [];
  searchCalls(searchParams: CallSearchParameters) {
    this.qualityCallsCallService.clearValues();
    this.clearInputs();
    this.callListLoader = true;
    this.qualityHttpService
      .getCallRecords(searchParams)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error) => {
          this.messageService.sendError(error.detail);
          this.callListLoader = false;
          return of(null);
        })
      )
      .subscribe((data) => {
        if (data) {
          this._callsList$.next([]);
          this._callsList$.next(data);
          this.callList = data;
          this.callListLoader = false;
          this._isCallsLoaded$.next(true);
        }
      });
  }
  clearInputs() {
    this.vrIDInput = '';
    this.callTypeInput = '';
    this.loginInput = '';
    this.startTimeInput = '';
    this.durationInput = '';
    this.contractIdInput = '';
    this.phoneNumberInput = '';
  }

  searchInColumn(columnName: string, searchTerm: string) {
    this.inputFilters[columnName] = searchTerm;
    const filteredCalls = this.callList.filter((row: any) => {
      return Object.keys(this.inputFilters).every((key) => {
        if (this.inputFilters[key] === '') {
          return true;
        }
        const cellValue = row[key];
        return (
          cellValue !== null &&
          cellValue !== undefined &&
          cellValue
            .toString()
            .toLowerCase()
            .includes(this.inputFilters[key].toLowerCase())
        );
      });
    });
    this._callsList$.next(filteredCalls);
  }
}
