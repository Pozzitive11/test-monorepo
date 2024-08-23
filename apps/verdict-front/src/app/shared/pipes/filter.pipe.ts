import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe<T extends { name: string }> implements PipeTransform {
  transform(items: T[], searchText: string): T[] {
    if (!items.length) return []
    if (!searchText) return items

    searchText = searchText.toLowerCase()
    return items.filter(item => {
      return item.name.toLowerCase().includes(searchText)
    })
  }
}
