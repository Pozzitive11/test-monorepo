import { DestroyRef, inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  from,
  map,
  Observable,
  tap,
} from 'rxjs';
import { DcHttpService } from './dc-http.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UtilFunctions } from '../../../shared/utils/util.functions';

@Injectable({
  providedIn: 'root',
})
export class DcSendingDocsFiltersService {
  private readonly httpService = inject(DcHttpService);
  private readonly destroyRef = inject(DestroyRef);
  private _allCredits$ = new BehaviorSubject<{ [key: string]: any }[]>([]);
  private _filteredCredits$ = new BehaviorSubject<{ [key: string]: any }[]>([]);
  readonly selectedWays$ = new BehaviorSubject<string[]>([]);
  readonly selectedRowIds$ = new BehaviorSubject<number[]>([]);
  readonly appliedFilters$ = new BehaviorSubject<any[]>(['downloadDocuments']);
  textFilters: { col: string; value: string }[] = [];
  documentFilters: string[] = [];

  filteredCredits$ = from(this._filteredCredits$);

  initializeData(): void {
    this.httpService
      .getSendingDocs()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this._allCredits$.next(data);
      });
  }

  toggleRowSelection(id: number): void {
    const selectedRows = this.selectedRowIds$.value;

    if (selectedRows.includes(id)) {
      this.selectedRowIds$.next(selectedRows.filter((rowId) => rowId !== id));
    } else {
      this.selectedRowIds$.next([...selectedRows, id]);
    }
  }

  addFilter(filter: string): void {
    this.appliedFilters$.next([filter]);
  }

  applyDownloadFilter(
    credits: { [key: string]: any }[]
  ): { [key: string]: any }[] {
    return credits.filter(
      (credit) => credit['Дата експорту документа'] === null
    );
  }

  applyConfirmSendingFilter(
    credits: { [key: string]: any }[]
  ): { [key: string]: any }[] {
    return credits.filter(
      (credit) =>
        credit['Дата експорту документа'] !== null &&
        credit['Дата відправки'] === null
    );
  }

  applyConfirmedFilter(
    credits: { [key: string]: any }[]
  ): { [key: string]: any }[] {
    return credits.filter(
      (credit) => typeof credit['Дата відправки'] === 'string'
    );
  }
  applyDocumentFilters(
    credits: { [key: string]: any }[]
  ): { [key: string]: any }[] {
    if (this.documentFilters.length === 0) {
      return credits;
    }

    return credits.filter((credit) => {
      return this.documentFilters.every((filter) => credit[filter] === true);
    });
  }
  toggleWayFilter(wayType: string): void {
    const selectedWays = this.selectedWays$.value;

    if (selectedWays.includes(wayType)) {
      this.selectedWays$.next(selectedWays.filter((way) => way !== wayType));
    } else {
      this.selectedWays$.next([...selectedWays, wayType]);
    }
  }

  deselectRow(id: number): void {
    const selectedRows = this.selectedRowIds$.value;
    this.selectedRowIds$.next(selectedRows.filter((rowId) => rowId !== id));
  }

  selectRow(id: number): void {
    const selectedRows = this.selectedRowIds$.value;
    if (!selectedRows.includes(id)) {
      this.selectedRowIds$.next([...selectedRows, id]);
    }
  }

  getFilteredApplications(): Observable<{ [key: string]: any }[]> {
    return combineLatest([
      this._allCredits$,
      this.appliedFilters$,
      from(this.selectedWays$),
    ]).pipe(
      map(([credits, appliedFilters, selectedWays]) => {
        let filteredApplications = [...credits];
        filteredApplications = UtilFunctions.filterData(
          filteredApplications,
          this.textFilters
        );

        if (appliedFilters.includes('downloadDocuments')) {
          filteredApplications = this.applyDownloadFilter(filteredApplications);
        }
        if (appliedFilters.includes('confirmSending')) {
          filteredApplications =
            this.applyConfirmSendingFilter(filteredApplications);
        }
        if (appliedFilters.includes('confirmed')) {
          filteredApplications =
            this.applyConfirmedFilter(filteredApplications);
        }

        if (selectedWays.length > 0) {
          filteredApplications = filteredApplications.filter((credit) => {
            return selectedWays.some((way) =>
              credit['Шляхи відправки'].includes(way)
            );
          });
        }
        filteredApplications = this.applyDocumentFilters(filteredApplications);
        return filteredApplications;
      }),
      tap((filteredApplications) => {
        this._filteredCredits$.next(filteredApplications);
      })
    );
  }
}
