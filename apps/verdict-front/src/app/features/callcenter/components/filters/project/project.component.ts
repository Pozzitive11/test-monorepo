import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { ProjectFilterModel } from '../../../models/filters.model'
import { CcFiltersService } from '../../../services/cc-filters.service'
import { Subscription } from 'rxjs'
import { NgFor } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ClickOutsideDirective } from '../../../../../shared/directives/click-outside.directive'


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  standalone: true,
  imports: [
    ClickOutsideDirective,
    FormsModule,
    NgFor
  ]
})
export class ProjectComponent implements OnInit, OnDestroy {
  private ccFilters = inject(CcFiltersService)

  selectedProjects: ProjectFilterModel[] = []
  projects: ProjectFilterModel[] = []
  projectsFiltered: ProjectFilterModel[] = []
  textFilter: string = ''

  projectsChange$?: Subscription

  ngOnInit(): void {
    this.projectsChange$ = this.ccFilters.projectsChange
      .subscribe({
        next: (newProjects: ProjectFilterModel[]) => {
          this.projects = newProjects
          this.projectsFiltered = newProjects
          this.textFilter = ''

          const oldSelectedProjectsLength = this.selectedProjects.length
          this.selectedProjects = this.projects
            .filter(value => this.ccFilters.selectedProjects.includes(value.ID))

          if (oldSelectedProjectsLength !== this.selectedProjects.length) this.sendChangesToFilter()
        }
      })
  }

  ngOnDestroy(): void {
    this.projectsChange$?.unsubscribe()
  }


  toggleShow(dropMenu: HTMLUListElement) {
    dropMenu.classList.contains('show') ? dropMenu.classList.remove('show') : dropMenu.classList.add('show')
  }

  clearChosen(clear: boolean) {
    if (clear) this.selectedProjects = []
    else this.selectedProjects = this.projectsFiltered

    this.sendChangesToFilter()
  }


  selectProject(project: ProjectFilterModel) {
    if (this.isSelected(project)) {
      this.selectedProjects = this.selectedProjects.filter(prjct => prjct.ID !== project.ID)
    } else {
      this.selectedProjects.push(project)
    }

    this.sendChangesToFilter()
  }

  isSelected(project: ProjectFilterModel) {
    return this.selectedProjects.some(value => value.ID === project.ID)
    // for (let prjct of this.selectedProjects) {
    //   if (prjct.ID === project.ID) { return true }
    // }
    // return false;
  }

  filterChanged() {
    if (this.textFilter.length === 0) this.projectsFiltered = this.projects
    this.projectsFiltered = this.projects.filter(
      project => { return project.ProjectName.toLowerCase().includes(this.textFilter.toLowerCase()) }
    )

    this.sendChangesToFilter()
  }

  private sendChangesToFilter() {
    this.ccFilters.projectsSelected(this.selectedProjects.map((value) => value.ID))
  }
}
