import { Component, Input } from '@angular/core';
import { ProjectRnumberTable } from '../../../abstract-classes/project-rnumber.class';
import {
  CCMailsRowModel,
  CCMailsTableModel,
} from '../../../models/report-models';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-template-mails-table',
  templateUrl: './template-mails-table.component.html',
  standalone: true,
  imports: [NgIf, NgFor, DecimalPipe],
})
export class TemplateMailsTableComponent extends ProjectRnumberTable {
  @Input() override reportData?: CCMailsTableModel;

  constructor() {
    super();
  }

  // TEMPLATES STUFF
  getTemplateLen(TemplateNum: number | undefined): number {
    if (typeof TemplateNum === 'undefined')
      throw TypeError('TemplateNum is somehow is undefined ???');
    if (!this.reportData) return 0;

    let len = this.reportData.rows.filter((reportRow) => {
      return (
        reportRow.TemplateNum === TemplateNum &&
        !this.hiddenRows.includes(reportRow.RowNum) &&
        !reportRow.TemplateName.includes('Всього')
      );
    }).length;

    return len > 0 ? len : 1;
  }

  isFirstTemplateRow(row: CCMailsRowModel): boolean {
    if (!this.reportData) return false;

    for (let reportRow of this.reportData.rows) {
      if (
        reportRow.TemplateNum === row.TemplateNum &&
        !this.hiddenRows.includes(reportRow.RowNum)
      )
        return reportRow.RowNum === row.RowNum;
    }

    return true;
  }

  isTemplateHidden(TemplateNum: number | undefined): boolean {
    if (typeof TemplateNum === 'undefined')
      throw TypeError('TemplateNum is somehow is undefined ???');
    if (!this.reportData) return false;

    return (
      this.reportData.rows.filter((reportRow) => {
        return (
          reportRow.TemplateNum === TemplateNum &&
          !reportRow.TemplateName.includes('Всього') &&
          !this.hiddenRows.includes(reportRow.RowNum)
        );
      }).length === 1
    );
  }

  toggleTemplate(TemplateNum: number | undefined) {
    if (typeof TemplateNum === 'undefined')
      throw TypeError('TemplateNum is somehow is undefined ???');
    if (!this.reportData) return;

    if (this.isTemplateHidden(TemplateNum)) {
      let projectRowNums: number[] = [];
      for (let row of this.reportData.rows) {
        if (row.TemplateName.includes('Всього')) continue;
        if (row.TemplateNum === TemplateNum) {
          projectRowNums.push(row.RowNum);
        }
      }
      this.hiddenRows = this.hiddenRows.filter((rowNum) => {
        return !projectRowNums.includes(rowNum);
      });
    } else {
      const projectRows = this.reportData.rows
        .filter((reportRow) => {
          return reportRow.TemplateNum === TemplateNum;
        })
        .slice(0, -1);

      for (let row of projectRows) this.hiddenRows.push(row.RowNum);
    }
  }

  hideAllTemplates() {
    if (!this.reportData) return;

    for (let row of this.reportData.rows) {
      if (!this.isTemplateHidden(row.TemplateNum))
        this.toggleTemplate(row.TemplateNum);
    }
  }

  showAllTemplates() {
    if (!this.reportData) return;

    for (let row of this.reportData.rows) {
      if (this.isTemplateHidden(row.TemplateNum))
        this.toggleTemplate(row.TemplateNum);
    }
  }

  areTemplatesHidden(): boolean {
    if (!this.reportData) return false;

    for (let row of this.reportData.rows) {
      if (this.isTemplateHidden(row.TemplateNum)) return true;
    }

    return false;
  }

  //
  //
  // // PROJECTS STUFF
  //
  // getProjectLen(project: string): number {
  //   if (!this.reportData) return 0;
  //   if (project.includes('Всього')) return 1;
  //
  //   return this.reportData.rows.filter(
  //     (reportRow) => {
  //       return !this.hiddenRows.includes(reportRow.RowNum) && reportRow.ProjectName === project;
  //     }
  //   ).length;
  // }
  //
  // isFirstProjectRow(row: ProjectRnumberRowModel): boolean {
  //   if (!this.reportData) return false;
  //
  //   for (let reportRow of this.reportData.rows) {
  //     if (
  //       reportRow.ReestrNum === row.ReestrNum
  //       && !this.hiddenRows.includes(reportRow.RowNum)
  //       && reportRow.ProjectName === row.ProjectName
  //     ) return reportRow.RowNum === row.RowNum;
  //   }
  //   return true;
  // }
  //
  // isProjectHidden(project: string) {
  //   if (!this.reportData) return false;
  //   if (project.includes('Всього')) return false;
  //
  //   return  this.reportData.rows.filter(
  //     (reportRow) => {
  //       return reportRow.ProjectName === project && !this.hiddenRows.includes(reportRow.RowNum);
  //     }
  //   ).length <= 1;
  // }
  //
  // toggleProject(project: string) {
  //   if (!this.reportData || project.includes('Всього')) return;
  //
  //   if (this.isProjectHidden(project)) {
  //     let projectRowNums: number[] = [];
  //     for (let row of this.reportData.rows) {
  //       if (row.ProjectName === project) {
  //         projectRowNums.push(row.RowNum);
  //       }
  //     }
  //     this.hiddenRows = this.hiddenRows.filter(
  //       (rowNum) => { return !projectRowNums.includes(rowNum) }
  //     )
  //   }
  //
  //   else {
  //     const projectRows = this.reportData.rows.filter(
  //       (reportRow) => { return reportRow.ProjectName === project; }
  //     ).slice(0, -1);
  //
  //     for (let row of projectRows)
  //       this.hiddenRows.push(row.RowNum);
  //   }
  //
  // }
  //
  // hideAllProjects() {
  //   if (!this.reportData) return;
  //
  //   for (let row of this.reportData.rows) {
  //     if (row.ProjectName.includes('Всього'))
  //       continue;
  //     if (!this.isProjectHidden(row.ProjectName))
  //       this.toggleProject(row.ProjectName);
  //   }
  // }
  //
  // showAllProjects() {
  //   if (!this.reportData) return;
  //
  //   for (let row of this.reportData.rows) {
  //     if (row.ProjectName.includes('Всього'))
  //       continue;
  //     if (this.isProjectHidden(row.ProjectName))
  //       this.toggleProject(row.ProjectName);
  //   }
  // }
  //
  // areProjectsHidden(): boolean {
  //   if (!this.reportData) return false;
  //
  //   for (let row of this.reportData.rows) {
  //     if (row.ProjectName.includes('Всього'))
  //       continue;
  //     if (this.isProjectHidden(row.ProjectName))
  //       return true;
  //   }
  //
  //   return false;
  // }
}
