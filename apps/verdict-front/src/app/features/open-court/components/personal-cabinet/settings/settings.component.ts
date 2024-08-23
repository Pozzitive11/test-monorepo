import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserInfoService } from './settings.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {
  userInfo = {
    fullName: '',
    taxId: '',
    email: '',
    phone: '',
    address: ''
  };

  constructor(private userInfoService: UserInfoService,private router: Router) {}

  ngOnInit() {
    const savedUserInfo = this.userInfoService.getUserInfo();
    if (savedUserInfo) {
      this.userInfo = savedUserInfo;
    }
  }

  onSubmit() {
    this.userInfoService.saveUserInfo(this.userInfo);
    alert('Інформацію збережено в локальному сховищі.');
    
    this.router.navigate(['/opencourt/personal_cabinet/user-info']);// Убедитесь, что путь корректен
  }
}
