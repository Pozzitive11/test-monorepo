export interface SheetUIModel {
  column_widths: [string, number][]
  row_heights: [string | number, number][]
  page_size: number
  font_size: number
  header_colors: [string, string][]
  scale: number
  hidden_columns: string[]
}
