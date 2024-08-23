import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'customDateFormat'
})
export class CustomDateFormatPipe implements PipeTransform {
  transform(value: Date): string {
    return formatDate(value, 'dd MMMM yyyy', 'uk-UA'); // Форматування дати "день місяця рік" для української мови
  }
}
