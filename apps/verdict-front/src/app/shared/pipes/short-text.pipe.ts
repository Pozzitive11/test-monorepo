import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'shortText',
  standalone: true
})
export class ShortTextPipe implements PipeTransform {

  transform(value: string, symbols: number = 50): string {
    if (value.length > symbols)
      return value.slice(0, symbols - 3) + '...'
    else
      return value
  }

}
