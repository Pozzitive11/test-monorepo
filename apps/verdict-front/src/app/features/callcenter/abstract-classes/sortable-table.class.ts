export abstract class SortableTable {
  abstract shownData: any[]
  abstract reportData: any[]

  abstract changeSortType(column: string): void

  abstract hideAllColumn(column: string): void

  abstract hideRow(...args: number[]): void

  abstract countColumnLength(row: any): number

  abstract updateShownData(): void
}

