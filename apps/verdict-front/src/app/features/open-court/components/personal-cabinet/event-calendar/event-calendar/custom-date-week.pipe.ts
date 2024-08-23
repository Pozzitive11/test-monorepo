import { Pipe, PipeTransform } from '@angular/core';
import { startOfWeek, endOfWeek, format } from 'date-fns';
import { Locale } from 'date-fns';
@Pipe({
  name: 'customWeekDate',
  standalone: true,
  pure: true
})
export class CustomWeekDatePipe implements PipeTransform {
  transform(startDate: Date): string {
    if (!(startDate instanceof Date)) {
      return '';
    }

    const startOfWeek = this.getStartOfWeek(startDate);
    const endOfWeek = this.getEndOfWeek(startOfWeek);

    const startFormatted = this.formatDate(startOfWeek);
    const endFormatted = this.formatDate(endOfWeek);

    return `${startFormatted} - ${endFormatted}`;
  }

  private getStartOfWeek(date: Date): Date {
    const dayOfWeek = date.getDay(); // 0 - воскресенье, 1 - понедельник, ..., 6 - суббота
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek); // Устанавливаем день недели на воскресенье
    return startOfWeek;
  }

  private getEndOfWeek(startOfWeek: Date): Date {
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6); // Устанавливаем день недели на субботу
    return endOfWeek;
  }

  private formatDate(date: Date): string {
    const day = this.padZero(date.getDate());
    const month = this.padZero(date.getMonth() + 1); // Месяцы в JavaScript начинаются с 0
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }

  private padZero(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }
}