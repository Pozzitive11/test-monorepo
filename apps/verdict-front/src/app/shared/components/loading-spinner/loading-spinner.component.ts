import { Component, Input } from '@angular/core'

@Component({
  standalone: true,
  selector: 'app-loading-spinner',
  template: `
    <div [class]="spinnerClass" style="{{ transform }}" [style.width.px]="size" [style.height.px]="size"></div>
  `,
  styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent {
  @Input() scale: number = 1
  @Input() spinnerClass: 'lds-hourglass' | 'loader-spinner' = 'lds-hourglass'
  @Input() size: number = 80

  get transform(): string { return `transform: scale(${this.scale})` }
}
