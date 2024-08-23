import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  private storageKey = 'userInfo';

  saveUserInfo(userInfo: any) {
    localStorage.setItem(this.storageKey, JSON.stringify(userInfo));
  }

  getUserInfo() {
    const userInfo = localStorage.getItem(this.storageKey);
    return userInfo ? JSON.parse(userInfo) : null;
  }

  clearUserInfo() {
    localStorage.removeItem(this.storageKey);
  }
}