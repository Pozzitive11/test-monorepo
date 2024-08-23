export interface sortType {
  column: string,
  none: boolean,
  down: boolean,
  up: boolean,
}


export abstract class SegmentationTableSort {
  abstract header: string[]
  abstract nonSortedColumns: string[]
  abstract sortTypes: sortType[]

  fillSorting() {
    for (let col of this.header)
      this.sortTypes.push({
        column: col,
        none: true,
        down: false,
        up: false
      })
  }

  saveSorts(column: string): { left: number, right: number } {
    let left = -1
    let right = 1
    for (let sort of this.sortTypes) {
      if (sort.column === column) {
        if (sort.none) {
          sort.down = true
          sort.none = false
        } else if (sort.down) {
          sort.up = true
          sort.down = false
          left = 1
          right = -1
        } else if (sort.up) {
          sort.down = true
          sort.up = false
        }
      } else {
        sort.none = true
        sort.up = false
        sort.down = false
      }
    }

    return { left: left, right: right }
  }

  getTooltip(column: string): string {
    switch (column) {
      case 'Доля %':
        return 'Відсотки/Outstanding*100'
      case 'Відхилення від середнього значення НКС без телефонів':
        return 'Враховуються НКС без жодного актуального телефону'
      case 'Кількість КД % від проєкту':
        return 'Відсоток кількості КД у рядку до загальної кількіості КД у проєкті'
      default:
        return ''
    }
  }

  getSortType(column: string): sortType {
    for (let sort of this.sortTypes)
      if (sort.column === column)
        return sort
    throw Error('Щось не так з колонками у сортуванні')
  };

  abstract changeSortType(column: string, change?: boolean): void;

}







