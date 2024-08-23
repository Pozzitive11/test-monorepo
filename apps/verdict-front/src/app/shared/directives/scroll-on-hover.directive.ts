import { Directive, ElementRef, HostListener, inject, Input } from '@angular/core'

@Directive({
  selector: '[scrollOnHover]',
  standalone: true
})
export class ScrollOnHoverDirective {
  // This directive is used to scroll a container (defined by the Input() scrollElement) when the mouse is hovering over it
  // The direction (up or down) is defined by the Input() scrollDirection
  // Scroll timeout is defined by the Input() scrollTimeout
  // Scroll speed is defined by the Input() scrollSpeed
  // The scroll is stopped when the mouse leaves the container

  @Input() scrollElement!: HTMLElement
  @Input() scrollDirection: 'up' | 'down' = 'down'
  @Input() scrollTimeout = 0
  @Input() scrollSpeed = 25

  private scrollInterval?: any
  private elementRef = inject(ElementRef)

  @HostListener('mouseenter')
  onMouseEnter() {
    this.scrollInterval = setInterval(() => {
      if (this.scrollDirection === 'down')
        this.scrollElement.scrollTop += this.scrollSpeed
      else
        this.scrollElement.scrollTop -= this.scrollSpeed
    }, this.scrollTimeout)
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    clearInterval(this.scrollInterval)
  }

}
