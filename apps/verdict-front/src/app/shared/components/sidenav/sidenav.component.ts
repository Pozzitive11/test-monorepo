import { animate, keyframes, style, transition, trigger } from '@angular/animations'
import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core'
import { INavbarData } from '../../models/i-navbar-data.model'
import { navbarData } from '../../models/i-nav-data.model'
import { SideNavToggle } from '../../models/side-nav-toggle.model'
import { SublevelMenuComponent } from '../sublevel-menu/sublevel-menu.component'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { ClickOutsideDirective } from '../../directives/click-outside.directive'
import { NgClass, NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['../../styles/sidenav.styles.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('350ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('350ms', style({ opacity: 0 }))
      ])
    ]),
    trigger('rotate', [
      transition(':enter', [
        animate('1000ms', keyframes([
          style({ transform: 'rotate(0deg)', offset: '0' }),
          style({ transform: 'rotate(2turn)', offset: '1' })
        ]))
      ])
    ])
  ],
  standalone: true,
  imports: [NgClass, ClickOutsideDirective, NgIf, RouterLink, NgFor, RouterLinkActive, SublevelMenuComponent]
})
export class SidenavComponent implements OnInit {

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter()
  collapsed = false
  screenWidth = 0
  navData = navbarData
  multiple: boolean = false

  @HostListener('window:resize', ['$event'])
  onResize(_: any) {
    this.screenWidth = window.innerWidth
    if (this.screenWidth <= 768) {
      this.collapsed = false
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth })
    }
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth })
  }

  closeSidenav(): void {
    this.collapsed = false
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth })
  }

  handleClick(item: INavbarData): void {
    if (!this.multiple) {

      for (let modelItem of this.navData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false
        }
      }
    }
    item.expanded = !item.expanded
  }
}
