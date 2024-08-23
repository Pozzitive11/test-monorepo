import { Directive, ElementRef, EventEmitter, HostListener, inject, Output } from '@angular/core'

@Directive({
  selector: '[clickOutside]',
  standalone: true
})
export class ClickOutsideDirective {
  @Output() public clickOutside = new EventEmitter<Event>()
  private _elementRef = inject(ElementRef)

  @HostListener('document:click', ['$event'])
  public onClick(event: Event): void {
    if (this._elementRef.nativeElement.contains(event.target)) {
    } else this.clickOutside.emit(event)
  }
}
