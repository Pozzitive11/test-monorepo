import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';

@Injectable()
export class CustomDateFormatter extends CalendarDateFormatter {
    public override dayViewHour({ date, locale }: DateFormatterParams): string {
      const safeLocale = locale || 'uk-UA';
      return formatDate(date, 'HH:mm', safeLocale);
    }
    public override weekViewHour({ date, locale }: DateFormatterParams): string {
        const safeLocale = locale || 'uk-UA';
        return formatDate(date, 'HH:mm', safeLocale);
      }
  }
