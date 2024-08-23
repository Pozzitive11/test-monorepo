import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate',
  standalone: true
})
export class CustomDatePipe implements PipeTransform {
  transform(value: Date | string | number, locale: string = 'uk'): string {
    const date = new Date(value);
    const day = this.padZero(date.getDate());
    const month = this.padZero(date.getMonth() + 1); // Месяцы в JavaScript начинаются с 0
    const year = date.getFullYear();
    const weekday = date.toLocaleDateString(locale, { weekday: 'long' });
    
    return `${day}.${month}.${year} (${weekday})`;
  }

  private padZero(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }
}