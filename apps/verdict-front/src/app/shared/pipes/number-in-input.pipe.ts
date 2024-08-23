import { Pipe, PipeTransform } from '@angular/core'
import { UtilFunctions } from '../utils/util.functions'

@Pipe({
  name: 'numberInInput',
  standalone: true
})
export class NumberInInputPipe implements PipeTransform {

  transform(value: string | undefined): string | undefined {
    return UtilFunctions.formatNumber(value)
  }

}
