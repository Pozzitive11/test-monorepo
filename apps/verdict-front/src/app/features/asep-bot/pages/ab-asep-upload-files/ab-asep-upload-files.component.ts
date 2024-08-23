import { Component, inject, OnInit } from '@angular/core';
import { AbAsepBotDataService } from '../../services/ab-asep-bot-data.service';
import { AbHttpService } from '../../services/ab-http.service';
import { AsepUserFilesInfoComponent } from '../../../../shared/components/asep-user-files-info/asep-user-files-info.component';
import { AuthService } from 'apps/verdict-front/src/app/core/services/auth.service';

@Component({
  selector: 'app-ab-asep-upload-files',
  templateUrl: './ab-asep-upload-files.component.html',
  standalone: true,
  imports: [AsepUserFilesInfoComponent],
})
export class AbAsepUploadFilesComponent implements OnInit {
  private authService = inject(AuthService);
  private httpService = inject(AbHttpService);
  asepService = inject(AbAsepBotDataService);

  get username() {
    return this.authService.loadedUser?.username;
  }

  ngOnInit(): void {
    this.updateUserFiles();
  }

  updateUserFiles() {
    if (!this.username) return;

    this.httpService
      .getFiles(this.username)
      .subscribe(
        (data) => (this.asepService.uploadedUserFiles = data.uploaded_files)
      );
  }
}
