import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UserInfoService } from './settings.service';


@Component({
  selector: 'app-user-info-display',
  standalone: true,
  templateUrl: './user-info-display.component.html',
  styles: [`
    .info-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9f9f9;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      font-family: 'Arial', sans-serif;
    }

    h2 {
      text-align: center;
      margin-bottom: 20px;
      color: #333;
    }

    .info-group {
      margin-bottom: 15px;
    }

    .info-group label {
      display: block;
      font-weight: bold;
      color: #666;
    }

    .info-value {
      display: block;
      margin-top: 5px;
      padding: 10px;
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 4px;
      color: #333;
    }

    .btn-primary {
      display: block;
      width: 100%;
      padding: 10px;
      background-color: #007bff;
      border: none;
      border-radius: 4px;
      color: #fff;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s;
      margin-top: 20px;
    }

    .btn-primary:hover {
      background-color: #0056b3;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserInfoDisplayComponent implements OnInit {
  userInfo: any = {};

  constructor(private userInfoService: UserInfoService) {}

  ngOnInit() {
    this.userInfo = this.userInfoService.getUserInfo();
  }

  goBack() {
    // Implement navigation back to settings or other appropriate action
  }
}
