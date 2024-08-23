import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { SideNavToggle } from './shared/models/side-nav-toggle.model';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { SidenavComponent } from './shared/components/sidenav/sidenav.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { AuthComponent } from './shared/components/auth/auth.component';
import { MessageBoxComponent } from './shared/components/message-box/message-box.component';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    NgIf,
    RouterOutlet,
    SidenavComponent,
    HeaderComponent,
    AuthComponent,
    MessageBoxComponent,
    NgbAlert,
  ],
})
export class AppComponent implements OnInit {
  private auth = inject(AuthService);

  title = 'Verdict';
  isSideNavCollapsed = false;
  screenWidth = 0;

  showAlert = signal(true);

  get isAuthorized(): boolean {
    return this.auth.isAuthorized;
  }

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

  ngOnInit() {
    this.showAlert.set(!window.location.origin.includes('data-factory.ua'));
  }
}
