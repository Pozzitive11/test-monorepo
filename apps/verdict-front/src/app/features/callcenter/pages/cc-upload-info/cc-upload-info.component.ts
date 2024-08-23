import { Component, inject } from '@angular/core';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
import { CcInfoRulesComponent } from '../../components/cc-info-rules/cc-info-rules.component';
import { NavigationService } from 'apps/verdict-front/src/app/core/services/navigation.service';

@Component({
  selector: 'app-cc-upload-info',
  templateUrl: './cc-upload-info.component.html',
  styleUrls: ['./cc-upload-info.component.css'],
  standalone: true,
  imports: [CcInfoRulesComponent, FileUploadComponent],
})
export class CcUploadInfoComponent {
  private navigation = inject(NavigationService);

  fileList: any;

  onUploadFile(data: any) {}

  removeFile(data: any) {}

  uploadFiles() {}
}
