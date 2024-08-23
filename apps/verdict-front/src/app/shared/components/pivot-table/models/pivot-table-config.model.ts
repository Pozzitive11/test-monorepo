export interface IPivotConfig {
  // TODO: add support for custom agg functions
  // aggFunctions: { [p: string]: (val: TValue[]) => TValue }
  // aggFunctionsDescriptions: { [p: string]: string }
  // aggFunctionsReverse: { [p: string]: (val: TValue, gVal: TValue[]) => boolean }

  name: string
  selectedValues: string[]
  selectedIndex: string[]
  selectedFilterKeys: string[]
  selectedAggFunctions: string[]
  selectedAliases: string[]
  selectedFilters: { [key: string]: string[] }
  selectedSorting: { [col: string]: boolean | undefined }
  selectedTabs: string[]
  selectedButtonFiltersKeys?: string[]
}

// do we really need this?
export const IPivotConfigValidation = (config: IPivotConfig) => {
  if (config.selectedValues.length !== config.selectedAggFunctions.length || config.selectedAggFunctions.length !== config.selectedAliases.length) {
    throw new Error('Кривий конфіг 🤯')
  }

  return true
}
