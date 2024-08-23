import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'pagination',
  standalone: true
})
export class PaginationPipe implements PipeTransform {

  transform<T>(value: T[], page: number, rowsPerPage: number): T[] {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage
    return value.slice(start, end)
  }

}
