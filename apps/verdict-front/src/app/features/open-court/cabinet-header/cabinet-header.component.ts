import { NgIf, NgClass, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { MyCasesTableComponent } from "../components/personal-cabinet/my-cases/my-cases-table/my-cases-table.component";
import { EventCalendarComponent } from "../components/personal-cabinet/event-calendar/event-calendar/event-calendar.component";

@Component({
    selector: 'app-cabinet-header',
    standalone: true,
    templateUrl: './cabinet-header.component.html',
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgIf, NgClass, NgFor, MyCasesTableComponent, EventCalendarComponent]
})
export class CabinetHeaderComponent {
  showPersonalCabinet = false;
  notificationCount: number = 0;
showNotifications: boolean = false;
  showCourtNotifications: boolean = true;
  showExecutionNotifications: boolean = false;
  courtCaseNumbers: number[] = [];
  courtNotifications: string[] = [];
  executionNotifications: string[] = [];
  activeTab: string = 'eventCalendar';
  constructor( private router: Router){

  }
  
  switchToMainTab(): void {
    this.activeTab = 'main';
  }
  
  switchToInstancesTab(): void {
    this.activeTab = 'instances';
  
}
// togglePersonalCabinet(): void {
//   this.showPersonalCabinet = !this.showPersonalCabinet;
//   if (this.showPersonalCabinet) {
//     this.router.navigate(['/opencourt/personal_cabinet']); // Перенаправление на новую страницу
//   }
// }
togglePersonalCabinet() {
  this.showPersonalCabinet = !this.showPersonalCabinet;
}
goToPersonalCabinet() {
  this.router.navigate(['/opencourt/personal_cabinet']);
}
goToMessages() {
  this.activeTab = 'myCases'; // Устанавливаем активную вкладку
  this.router.navigate(['/opencourt/personal_cabinet']);
}
toggleNotifications() {
  this.router.navigate(['/opencourt/personal_cabinet']);
}
switchToCourtNotifications() {
  this.showCourtNotifications = true;
  this.showExecutionNotifications = false;
}

switchToExecutionNotifications() {
  this.showCourtNotifications = false;
  this.showExecutionNotifications = true;
}


  switchToMyCases(): void {
    this.activeTab = 'myCases';
  }

  switchToEventCalendar(): void {
    this.activeTab = 'eventCalendar';
  }
}



