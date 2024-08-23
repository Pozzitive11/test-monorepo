import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customMonthDate',
  standalone: true
})
export class CustomMonthDatePipe implements PipeTransform {
  transform(value: Date | string | number, locale: string = 'uk'): string {
    const date = new Date(value);
    const month = this.capitalizeFirstLetter(date.toLocaleDateString(locale, { month: 'long' }));
    const year = date.getFullYear();
    return `${month} ${year}`;
  }

  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}