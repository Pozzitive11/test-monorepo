import { DictionaryModel } from '../models/filters.model'


export abstract class FilterDropdown {
  allValues: DictionaryModel[] = []
  selectedValues: DictionaryModel[] = []

  toggleShow(dropMenu: HTMLUListElement) {
    dropMenu.classList.contains('show') ? dropMenu.classList.remove('show') : dropMenu.classList.add('show')
  }

  selectValue(value: DictionaryModel) {
    if (this.isSelected(value)) {
      this.selectedValues = this.selectedValues.filter(
        selectedValue => { return selectedValue.id !== value.id }
      )
    } else {
      this.selectedValues.push(value)
    }

    this.sendChangesToFilter()
  }

  clearChosen(clear: boolean) {
    if (clear) this.selectedValues = []
    else this.selectedValues = this.allValues

    this.sendChangesToFilter()
  }

  isSelected(value: DictionaryModel): boolean {
    for (let selectedValue of this.selectedValues) {
      if (selectedValue.id === value.id) { return true }
    }
    return false
  }

  abstract sendChangesToFilter(): void;

}





