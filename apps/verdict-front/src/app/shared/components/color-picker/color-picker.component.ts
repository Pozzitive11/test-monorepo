import { ChangeDetectionStrategy, Component, model, OnInit, signal } from '@angular/core'

@Component({
  selector: 'app-color-picker',
  standalone: true,
  imports: [],
  template: `
    <div class="input-group mb-3">
      <input type="color" [value]="color()" (input)="updateColor($event)" class="form-control form-control-color" />
      <input type="text" [value]="color()" (input)="updateColor($event)" class="form-control" />
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorPickerComponent implements OnInit {
  color = model.required<string>()
  startColor = signal<string>('')

  ngOnInit() {
    this.startColor.set(this.color())
    console.log(this.startColor())
  }

  updateColor($event: Event) {
    this.color.set(($event.target as HTMLInputElement).value)
  }
}
