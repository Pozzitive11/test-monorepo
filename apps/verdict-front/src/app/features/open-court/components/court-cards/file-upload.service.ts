import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// export interface UploadedFile {
//   id?: number;
//   subscriptionId: number;
//   fileName?: string;
//   instanceId: number;
//   judgmentFormId: number;
//   filePath?: string;
//   createdAt?: string;
//   deletedAt?: string;
//   file: File;
// }


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
//   private uploadedFilesSubject = new BehaviorSubject<UploadedFile[]>([]);
//   uploadedFiles$ = this.uploadedFilesSubject.asObservable();

//   addUploadedFile(file: UploadedFile) {
//     const currentFiles = this.uploadedFilesSubject.getValue();
//     this.uploadedFilesSubject.next([...currentFiles, file]);
//   }
// }
}
