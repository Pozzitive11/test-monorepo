import { animate, state, style, transition, trigger } from '@angular/animations'
import { Component, Input } from '@angular/core'
import { INavbarData } from '../../models/i-navbar-data.model'

import { RouterLink, RouterLinkActive } from '@angular/router'
import { NgClass, NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'app-sublevel-menu',
  templateUrl: './sublevel-menu.component.html',
  styleUrls: ['../../styles/sidenav.styles.scss'],
  animations: [
    trigger('submenu', [
      state('hidden', style({
        height: '0',
        overflow: 'hidden'
      })),
      state('visible', style({
        height: '*'
      })),
      transition('visible <=> hidden', [style({ overflow: 'hidden' }), animate('{{transitionParams}}')]),
      transition('void => *', animate(0))
    ])
  ],
  standalone: true,
  imports: [NgIf, NgFor, NgClass, RouterLinkActive, RouterLink]
})
export class SublevelMenuComponent {
  @Input() data: INavbarData = {
    routeLink: '',
    icon: '',
    label: '',
    items: []
  }

  @Input() collapsed = false
  @Input() animating: boolean | undefined
  @Input() expanded: boolean | undefined
  @Input() multiple: boolean = false

  handleClick(item: any): void {
    if (this.multiple) {
      if (this.data.items && this.data.items.length > 0) {
        for (let modelItem of this.data.items) {
          if (item !== modelItem && modelItem.expanded) {
            modelItem.expanded = false
          }
        }

      }
    }
    item.expanded = !item.expanded
  }

}
