import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core'

@Directive({
  selector: '[scrollTracker]',
  standalone: true
})
export class ScrollTrackerDirective {
  // adjust this value to fine-tune the threshold for when the scroll end event is emitted
  @Input() scrollThreshold = 50
  @Output() scrollingFinished = new EventEmitter<void>()

  @HostListener('scroll', ['$event.target'])
  onScroll(target: HTMLElement) {
    const scrollPosition = target.scrollTop + target.clientHeight
    const scrollHeight = target.scrollHeight

    if (scrollHeight - scrollPosition <= this.scrollThreshold)
      this.scrollingFinished.emit()
  }

}
