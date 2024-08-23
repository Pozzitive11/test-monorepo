import { AfterViewInit, Directive, ElementRef, HostListener } from '@angular/core'

@Directive({
  selector: '[appEqualHeightCards]',
  standalone: true
})
export class EqualHeightCardsDirective implements AfterViewInit {

  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    this.adjustCardHeights();
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.adjustCardHeights();
  }

  adjustCardHeights() {
    const cards = this.el.nativeElement.querySelectorAll('.court-card');
    let maxHeight = 0;

    cards.forEach((card: HTMLElement) => {
      card.style.height = 'auto'; // Сначала установим автоматическую высоту
      const height = card.offsetHeight;
      if (height > maxHeight) {
        maxHeight = height;
      }
    });

    cards.forEach((card: HTMLElement) => {
      card.style.height = `${maxHeight}px`; // Применяем максимальную высоту ко всем карточкам
    });
  }
}
