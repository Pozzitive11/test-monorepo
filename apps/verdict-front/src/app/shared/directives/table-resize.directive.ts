import { Directive, ElementRef, inject, Input, Output } from '@angular/core'
import { distinctUntilChanged, filter, fromEvent, map, switchMap, takeUntil, tap } from 'rxjs'
import { DOCUMENT } from '@angular/common'

@Directive({
  selector: '[columnResize]',
  standalone: true
})
export class TableResizeDirective {
  private readonly documentRef = inject(DOCUMENT)
  private readonly elementRef = inject(ElementRef)

  @Input() minWidth: number = 1
  @Input() minHeight: number = 1

  @Output() columnResize = fromEvent<MouseEvent>(
    this.elementRef.nativeElement,
    'mousedown'
  ).pipe(
    filter((e) => e.target === this.elementRef.nativeElement.lastChild),
    tap((e) => e.preventDefault()),
    switchMap((event) => {
      const initialWidth = +this.elementRef.nativeElement.clientWidth
      const startX = event.pageX

      return fromEvent<MouseEvent>(this.documentRef, 'mousemove').pipe(
        map(({ clientX }) => initialWidth + (clientX - startX)),
        tap((width) => {
          if (width < this.minWidth) width = this.minWidth

          this.elementRef.nativeElement.style.minWidth = `${width}px`
          this.elementRef.nativeElement.style.width = `${width}px`
        }),
        distinctUntilChanged(),
        takeUntil(fromEvent(this.documentRef, 'mouseup'))
      )
    })
  )

  @Output() rowResize = fromEvent<MouseEvent>(
    this.elementRef.nativeElement,
    'mousedown'
  ).pipe(
    filter((e) => e.target === this.elementRef.nativeElement.lastChild),
    tap((e) => e.preventDefault()),
    switchMap((event) => {
      const initialHeight = +this.elementRef.nativeElement.clientHeight
      const startY = event.pageY

      return fromEvent<MouseEvent>(this.documentRef, 'mousemove').pipe(
        map(({ clientY }) => initialHeight + (clientY - startY)),
        tap((height) => {
          if (height < this.minHeight) height = this.minHeight

          this.elementRef.nativeElement.style.minHeight = `${height}px`
          this.elementRef.nativeElement.style.height = `${height}px`
        }),
        distinctUntilChanged(),
        takeUntil(fromEvent(this.documentRef, 'mouseup'))
      )
    })
  )

}
