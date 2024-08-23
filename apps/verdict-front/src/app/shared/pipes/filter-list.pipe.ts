import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'filterList',
  standalone: true
})
export class FilterListPipe implements PipeTransform {

  /*
    * Filter list by filterText and return only items from shownItems range
    *
    * @param valueList - list of values to filter
    * @param filterText - text to filter by (optional)
    * @param shownItems - range of items to return, default is [0, Infinity]
   */
  transform<T extends string>(valueList: T[], shownItems: [number, number] = [0, Infinity], filterText?: string): T[] {
    if (!filterText)
      return valueList.slice(shownItems[0], shownItems[1])

    return valueList
      .filter(value => value.toLowerCase().includes(filterText.toLowerCase()))
      .slice(shownItems[0], shownItems[1])
  }

}
