import { inject, Injectable, signal } from '@angular/core'
import { pageNamesModel } from '../../shared/models/page-names.model'
import { NavigationEnd, Router } from '@angular/router'
import { filter, map } from 'rxjs'
import { NavLinkInfo, navLinksDataModel } from '../../shared/models/nav-links-data.model'

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  lastLocation = signal<string>('/')
  currentLocation = signal<string>('/')
  currentPage = signal<string>(pageNamesModel.main)
  currentReport = signal<string>('')
  private readonly route = inject(Router)

  constructor() {
    this.route.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects)
    ).subscribe((url) => {
      this.setCurrent(url)
      this.lastLocation.set(this.currentLocation())
      this.currentLocation.set(url)
    })
  }

  navigate(page: string, callback?: () => void) {
    this.route.navigate(page.split('/')).then(callback)
  }

  navigateBack(defaultPage?: string) {
    this.route.navigate(
      this.lastLocation() === '/' && defaultPage ?
        defaultPage.split('/') :
        this.lastLocation() === '/' ? ['dashboard'] : this.lastLocation().split('/')
    ).then()
  }

  private setCurrent(url: string) {
    for (const page of navLinksDataModel.mainPartsPages) {
      if (url.startsWith(page.link)) {
        this.currentPage.set(page.name)
        break
      }
    }

    const checkChildren = (children: NavLinkInfo[]): NavLinkInfo | null => {
      if (!children?.length) return null

      for (const child of children) {
        if (child.child_links?.length) {
          const result = checkChildren(child.child_links)
          if (result) return result
        }

        if (url === child.link) return child
      }
      return null
    }

    this.currentReport.set(checkChildren(navLinksDataModel[this.currentPage()])?.name || '')
  }
}
