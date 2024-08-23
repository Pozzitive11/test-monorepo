import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { AuthService } from '../../../core/services/auth.service'
import { Subscription } from 'rxjs'
import { Router } from '@angular/router'
import { NavigationService } from '../../../core/services/navigation.service'
import { NavLinkInfo, navLinksDataModel } from '../../models/nav-links-data.model'
import { AccountInfoComponent } from '../account-info/account-info.component'
import { ProtectedLinkComponent } from '../protected-link/protected-link.component'
import { NgFor, NgIf } from '@angular/common'
import { NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgFor,
    ProtectedLinkComponent,
    NgbDropdownItem,
    NgIf,
    AccountInfoComponent
  ],
  styles: `
    .header-dropdown {
      scrollbar-color: #8890e7 #f0e0f5;
      scrollbar-width: thin;
    }
    .header-nav {
      width: 100%;
      z-index: 200;
      padding-left: 7rem;
      padding-right: 3rem;
      margin: 0;
    }
    @media (max-width: 991px) {
      .header-nav {
        padding-left: 5rem;
        padding-right: 0;
      }
    }
  `
})
export class HeaderComponent implements OnInit, OnDestroy {
  logInOut: string = 'Увійти'
  logInOut$: Subscription | undefined
  collapsed: boolean = true
  private authService = inject(AuthService)
  private route = inject(Router)
  protected navigation = inject(NavigationService)

  get links(): NavLinkInfo[] {
    if (Object.keys(navLinksDataModel).includes(this.navigation.currentPage())) {
      return navLinksDataModel[this.navigation.currentPage()].filter((link) => this.isLinkAvailable(link))
    } else return this.pages
  }

  get pages(): NavLinkInfo[] {
    return navLinksDataModel.mainPartsPages.filter((page) => this.isLinkAvailable(page))
  }

  ngOnInit(): void {
    this.logInOut$ = this.authService.user.subscribe((user) => {
      this.logInOut = !!user ? 'Вийти' : 'Увійти'
    })
  }

  ngOnDestroy(): void {
    this.logInOut$?.unsubscribe()
  }

  logIn_logOut() {
    this.logInOut === 'Увійти' ? this.route.navigate(['/login']) : this.authService.logOut()
  }

  goToPage(page: NavLinkInfo) {
    this.route.navigate([page.link]).then()
  }

  isLinkAvailable(link: NavLinkInfo) {
    if (!this.authService.loadedUser) return false

    for (let page of this.authService.loadedUser.pages) {
      if (page === link.link || link?.child_links?.length) return true
      if (page.endsWith('*') && link.link.startsWith(page.slice(0, -1))) return true
    }

    return false
  }
}
