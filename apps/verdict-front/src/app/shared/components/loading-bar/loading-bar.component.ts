import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { NgIf } from '@angular/common'

@Component({
  selector: 'app-loading-bar',
  standalone: true,
  imports: [NgbProgressbar, NgIf],
  template: `
    @if (loading()) {
      @if (!customType()) {
        <ngb-progressbar
          [type]="type()"
          [value]="100"
          [max]="100"
          [height]="'3px'"
          [animated]="true"
          [striped]="true"
          [class]="class()"
        ></ngb-progressbar>
      } @else if (customType() === 'inf-bar') {
        <div class="inf-bar"></div>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .inf-bar {
      height: 4px;
      --c: no-repeat radial-gradient(#3ce0e0 0 0, #1828f5);
      background: var(--c), var(--c), #eaf2ff;
      background-size: 60% 100%;
      border-radius: 10px;
      animation: l16 5s infinite;
    }

    @keyframes l16 {
      0% {
        background-position: -150% 0, -150% 0
      }
      66% {
        background-position: 250% 0, -150% 0
      }
      100% {
        background-position: 250% 0, 250% 0
      }
    }
  `
})
export class LoadingBarComponent {
  type = input<'success' | 'info' | 'warning' | 'danger' | 'primary' | 'secondary' | 'dark'>('secondary')
  class = input<string>('')
  customType = input<'inf-bar'>()
  loading = input<boolean>(false)
}
