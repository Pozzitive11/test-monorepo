import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { DocumentationHttpService } from './documentation-http.service';
import { Document } from '../models/documentation.model';
import { UtilFunctions } from '../../../shared/utils/util.functions';

@Injectable({
  providedIn: 'root',
})
export class DocumentationService {
  private documentationHttpService = inject(DocumentationHttpService);
  private destroyRef = inject(DestroyRef);

  docsList = signal<Document[]>([]);

  getDocList() {
    return this.documentationHttpService
      .getDocList()
      .pipe(
        tap((docs) => {
          this.docsList.set(docs);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  downloadFile(docId: number) {
    this.documentationHttpService
      .downloadDocFetch(docId)
      .pipe(
        tap((response) => {
          UtilFunctions.saveFileFromHttp(response, true);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
