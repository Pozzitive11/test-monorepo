import {
  DestroyRef,
  Injectable,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Call, ChildRecords } from '../models/calls.model';
import {
  BehaviorSubject,
  catchError,
  concatMap,
  delay,
  find,
  forkJoin,
  from,
  map,
  mergeMap,
  of,
  retry,
  retryWhen,
  take,
  tap,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { QualityHttpService } from './quality-http.service';
import { saveAs } from 'file-saver';
import { UserFromDB } from '../models/user.model';
import { MessageHandlingService } from '../../../shared/services/message-handling.service';

@Injectable({
  providedIn: 'root',
})
export class QualityCallsCallService {
  private qualityHttpService = inject(QualityHttpService);
  private destroyRef = inject(DestroyRef);
  private messageService = inject(MessageHandlingService);

  call = signal<Call | null>(null);

  childRecords = signal<ChildRecords[][] | null>(null);

  mixedAudioUrl = signal<string[]>([]);

  singleAudioUrls = signal<string[][]>([]);

  mixedFile = signal<{ file: Blob; filename: string | null }[]>([]);

  callInfoLoader = false;

  mixedFileLoader = false;
  singleFileLoader = false;

  silencePosition = signal('evenly');
  silencePositionLoader = false;

  operatorInfo: UserFromDB[] = [];

  constructor() {
    effect(() => {
      console.log('singleAudioUrls', this.singleAudioUrls());
    });
  }

  getSingleCall(recordId: number) {
    this.callInfoLoader = true;
    this.qualityHttpService
      .getCallRecords({ RecordId: recordId, IsDetails: true })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error) => {
          this.messageService.sendError(error.detail);
          this.callInfoLoader = false;

          return of(null);
        })
      )
      .subscribe((data) => {
        if (data) {
          this.call.set(data[0]);
          this.setChildRecords();
          this.callInfoLoader = false;
          this.getUserInfo();
        }
      });
  }

  setChildRecords() {
    const callResult = this.call();
    const vrID = callResult?.vrID.toString();
    if (vrID) {
      this.qualityHttpService
        .getChildRecords(vrID)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          catchError((error) => {
            this.messageService.sendError(error.detail);
            return of(null);
          })
        )
        .subscribe((data) => {
          if (data) {
            this.childRecords.set(data);
            this.getMixedRecord();
            this.getSingleRecords();
          }
        });
    }
  }

  getUserInfo() {
    this.qualityHttpService
      .getAllUsers()
      .pipe(
        map((users) =>
          users.filter((user) => user.Login === this.call()?.Login)
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data) => {
        if (data) {
          this.operatorInfo = data;
        }
      });
  }

  getMixedRecord() {
    this.mixedFile.set([]);
    this.mixedAudioUrl.set([]);
    const childRecords = this.childRecords();

    if (childRecords) {
      const fileNamesUrlSets = childRecords.map((recordSet) =>
        recordSet.map((record) => record.FileName)
      );
      from(fileNamesUrlSets)
        .pipe(
          concatMap((fileNamesUrl) => {
            // Перевіряємо, чи є хоча б один порожній рядок
            const hasEmptyFileName = fileNamesUrl.some(
              (fileName) => fileName.trim() === ''
            );

            if (hasEmptyFileName) {
              return of('');
            } else {
              return this.qualityHttpService
                .getRecordFile(fileNamesUrl, this.silencePosition())
                .pipe(
                  map((response) => ({ response, fileNamesUrl })),
                  retryWhen((errors) =>
                    errors.pipe(
                      tap((error) => {
                        this.messageService.sendError(
                          'Не вдалося отримати міксований файл'
                        );
                        this.silencePosition.set('end');
                      }),
                      delay(1000),
                      take(1),
                      tap(() => {
                        if (this.silencePosition() === 'end') {
                          this.getMixedRecord();
                        }
                      })
                    )
                  )
                );
            }
          })
        )
        .subscribe((result) => {
          if (typeof result === 'object' && result?.response.body) {
            const filename = this.getFilenameFromContentDisposition(
              result.response.headers.get('Content-Disposition')
            );
            const audioUrl = URL.createObjectURL(result.response.body);
            const file = { file: result.response.body, filename: filename };

            this.mixedAudioUrl.update((current) => [...current, audioUrl]);
            this.mixedFile.update((current) => [...current, file]);
          } else {
            // Якщо результат порожній, сетимо порожній рядок
            const currentAudioUrls = this.mixedAudioUrl();
            this.mixedAudioUrl.set([...currentAudioUrls, '']);
          }
          this.mixedFileLoader = false;
          this.silencePositionLoader = false;
        });
    }
  }

  clearValues() {
    this.childRecords.set(null);
    this.mixedAudioUrl.set([]);
    this.singleAudioUrls.set([]);
  }
  saveFile(index: number) {
    const mixedFile = this.mixedFile();
    const file = mixedFile[index].file;
    const fileName = mixedFile[index].filename;
    if (mixedFile && file && fileName) {
      saveAs(mixedFile[index].file, fileName);
    }
  }

  getSingleRecords() {
    this.singleAudioUrls.set([]);

    const singleAudioUrls: string[][] = [];

    this.childRecords()?.forEach((recordSet, index) => {
      singleAudioUrls[index] = [];
      recordSet.forEach((record) => {
        this.setSingleRecord(record.FileName, singleAudioUrls, index);
      });
    });
  }

  setSingleRecord(
    recordPath: string,
    singleAudioUrls: string[][],
    index: number
  ) {
    this.singleFileLoader = true;
    if (recordPath) {
      this.qualityHttpService
        .getRecordFile([recordPath], this.silencePosition())
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          catchError((error) => {
            this.messageService.sendError(error.detail);
            this.singleFileLoader = false;
            return of(null);
          })
        )
        .subscribe((data) => {
          if (data && data.body) {
            const url = URL.createObjectURL(data.body);
            singleAudioUrls[index].push(url);
          } else {
            singleAudioUrls[index].push('');
          }
          this.singleAudioUrls.set([...singleAudioUrls]);
          this.singleFileLoader = false;
        });
    } else {
      singleAudioUrls[index].push('');
      this.singleAudioUrls.set([...singleAudioUrls]);
      this.singleFileLoader = false;
    }
  }

  private getFilenameFromContentDisposition(
    contentDisposition: string | null
  ): string | null {
    if (!contentDisposition) {
      return null;
    }
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(contentDisposition);
    if (!matches || !matches[1]) {
      return null;
    }
    return matches[1].replace(/['"]/g, '');
  }
}
